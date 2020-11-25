import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import {exp} from 'react-native/Libraries/Animated/src/Easing';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';
import EventTypes from '../common/Event';
import PopularItem from '../common/PopularItem';
import actions from '../action';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import NavigationUtil from '../Navigator/NavigationUtil';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import FavoriteService from '../service/FavoriteService';
import {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';
import {onFlushPopularData} from '../action/popular';
import {onLoadLanguageData} from '../action/Languages';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

class PopularPage extends Component {
    constructor(props) {
        super(props);

        const {onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_key);
    }

    generateTabs() {
        const tabs = {};
        const {keys} = this.props;
        if (keys) {
            keys.forEach((key, index) => {
                if (key.checked) {
                    tabs[`tab${index}`] = {
                        screen: (props) => (
                            <TopPopularPage
                                {...props}
                                tabLabel={key.name}
                                theme={this.props.theme}
                            />
                        ),
                        navigationOptions: {
                            title: key.name,
                        },
                    };
                }
            });
        }
        return tabs;
    }

    render() {
        const {theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = (
            <NavigationBar
                title={'最热'}
                statusBar={statusBar}
                style={theme.styles.navBar}
            />
        );

        const {keys} = this.props;

        const TabNavigator = keys.length
            ? createAppContainer(
                  createMaterialTopTabNavigator(this.generateTabs(), {
                      tabBarOptions: {
                          tabStyle: styles.tabStyle,
                          scrollEnabled: true,
                          upperCaseLabel: false,
                          style: {
                              backgroundColor: theme.themeColor,
                          },
                          indicatorStyle: styles.indicatorStyle,
                          labelStyle: styles.labelStyle,
                      },
                  }),
              )
            : null;

        return (
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
            </View>
        );
    }
}

const mapPopularStateToProps = (state) => ({
    keys: state.language.keys,
    theme: state.theme.theme,
});

const mapPopularDispatchToProps = (dispatch) => ({
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(
    mapPopularStateToProps,
    mapPopularDispatchToProps,
)(PopularPage);

class TopPopular extends Component {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
        this.favoriteDidChanged = false;
    }

    componentDidMount() {
        this.loadData();

        EventBus.getInstance().addListener(
            EventTypes.EVENT_TYPE_POPULAR_FAVORITE_CHANGE,
            (this.favoriteChangeListener = (data) => {
                const id = data.item.id;
                const isFavorite = data.isFavorite;
                let store = this._store();

                for (let index = 0; index < store.items.length; index++) {
                    const element = store.items[index];
                    if (element.item.id === id) {
                        element.isFavorite = isFavorite;
                        break;
                    }
                }
                this.favoriteDidChanged = true;
            }),
        );
        EventBus.getInstance().addListener(
            EventTypes.EVENT_TYPE_TAB_SELECT_CHANGE,
            (this.tabSelectChangeListener = (data) => {
                if (data.to === 'PopularPage' && this.favoriteDidChanged) {
                    this.favoriteDidChanged = false;
                    const store = this._store();
                    const {onFlushPopularData} = this.props;
                    onFlushPopularData(
                        this.storeName,
                        store.pageIndex,
                        Setting.PAGESIZE,
                        store.items,
                    );
                }
            }),
        );
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.tabSelectChangeListener);
    }

    loadData(loadMore) {
        const {onLoadPopularData, onLoadMorePopular} = this.props;
        const store = this._store();
        const url = this.urlWithStoreName(this.storeName);
        if (loadMore) {
            onLoadMorePopular(
                this.storeName,
                ++store.pageIndex,
                Setting.PAGESIZE,
                store.items,
                (callback) => {
                    this.refs.toast.show('没有更多了');
                },
            );
        } else {
            onLoadPopularData(this.storeName, url, Setting.PAGESIZE);
        }
    }

    _store() {
        const {popular} = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                hideLoadingMore: true,
            };
        }
        return store;
    }

    urlWithStoreName(storeName) {
        return URL + storeName + QUERY_STR;
    }

    onSelect(data) {
        NavigationUtil.goPage(data, 'Detail');
    }

    onFavorite(item, isFavorite) {
        FavoriteService.updateFavorite(
            item,
            isFavorite,
            FLAG_PAGE.FLAG_PAGE_POPULAR,
        );
    }

    renderItem(data) {
        return (
            <PopularItem
                item={data}
                theme={this.props.theme}
                onFavorite={this.onFavorite}
                onSelect={(callback) => {
                    this.onSelect({
                        theme: this.props.theme,
                        type: FLAG_PAGE.FLAG_PAGE_POPULAR,
                        data: data,
                        callback,
                    });
                }}
            />
        );
    }

    generateIndicator() {
        return this._store().hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator} />
                <Text>正在加载更多</Text>
            </View>
        );
    }

    render() {
        const {popular, theme} = this.props;
        let store = this._store();

        return (
            <View>
                <FlatList
                    data={store.projectModes}
                    renderItem={(item) => this.renderItem(item.item)}
                    keyExtractor={(item) => '' + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                        />
                    }
                    ListFooterComponent={() => this.generateIndicator()}
                    onEndReached={() => {
                        this.loadData(true);
                    }}
                    onEndReachedThreshold={0.5}
                />
                <Toast ref={'toast'} position={'center'} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    popular: state.popular,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadPopularData: (storeName, url, pageSize) =>
        dispatch(actions.onLoadPopularData(storeName, url, pageSize)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) =>
        dispatch(
            actions.onLoadMorePopular(
                storeName,
                pageIndex,
                pageSize,
                items,
                callback,
            ),
        ),
    onFlushPopularData: (storeName, pageIndex, pageSize, items) =>
        dispatch(
            actions.onFlushPopularData(storeName, pageIndex, pageSize, items),
        ),
});

const TopPopularPage = connect(mapStateToProps, mapDispatchToProps)(TopPopular);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        minWidth: 50,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator: {
        color: 'red',
        margin: 10,
    },
});
