import React, {Component} from 'react';
import {
    Button,
    Settings,
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import EventBus from 'react-native-event-bus';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import Setting from '../common/setting';
import EventTypes from '../common/Event';
import actions from '../action';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import TimeSpan from '../modal/TimeSpan';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../Navigator/NavigationUtil';
import FavoriteService from '../service/FavoriteService';
import {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';
import {onLoadLanguageData} from '../action/Languages';
import {element} from 'prop-types';

const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';

class TrendingPage extends Component {
    constructor(props) {
        super(props);
        const {onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_language);
        this.prevLanguages = [];
        this.state = {
            timeSpan: TimeSpans[0],
        };
    }

    generateTabs() {
        let tabs = {};
        const {languages, theme} = this.props;
        this.prevLanguages = languages;
        this.prevTheme = theme;
        if (languages) {
            languages.forEach((language, index) => {
                if (language.checked) {
                    tabs[`tab${index}`] = {
                        screen: (props) => (
                            <TopTrending
                                {...props}
                                tabLabel={language.name}
                                timeSpan={this.state.timeSpan}
                                theme={theme}
                            />
                        ),
                        navigationOptions: {
                            title: language.name,
                        },
                    };
                }
            });
        }
        return tabs;
    }

    onSelect(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab,
        });
        DeviceEventEmitter.emit(EventTypes.EVENT_TYPE_TIME_SPAN_CHANGED, tab);
    }

    renderTrendingDialog() {
        return (
            <TrendingDialog
                ref={(dialog) => (this.dialog = dialog)}
                onSelect={(tab) => this.onSelect(tab)}
            />
        );
    }

    renderTitleView() {
        return (
            <TouchableOpacity
                onPress={() => this.dialog.show()}
                underlayColor="transparent">
                <View style={styles.row}>
                    <Text style={styles.title}>趋势 </Text>
                    <Text style={styles.title}>
                        {this.state.timeSpan.showText}
                    </Text>
                    <MaterialIcons
                        name={'arrow-drop-up'}
                        size={16}
                        color={'white'}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    checkIsUpdated(prevItems, items) {
        if (
            !prevItems ||
            !items ||
            !prevItems.length ||
            !items.length ||
            prevItems.length !== items.length
        ) {
            return true;
        }

        for (let index = 0; index < items.length; index++) {
            const element1 = items[index];
            const element2 = prevItems[index];
            if (
                element1.checked !== element2.checked ||
                element1.name !== element2.name
            ) {
                return true;
            }
        }
        return false;
    }

    generateTabNavigator() {
        const isUpdated = this.checkIsUpdated(
            this.prevLanguages,
            this.props.languages,
        );
        const {theme} = this.props;
        if (
            !this.tabNav ||
            isUpdated ||
            theme.themeColor !== this.prevTheme.themeColor
        ) {
            const {languages} = this.props;
            this.tabNav = languages.length
                ? createAppContainer(
                      createMaterialTopTabNavigator(this.generateTabs(), {
                          tabBarOptions: {
                              tabStyle: styles.tabStyle,
                              scrollEnabled: true,
                              upperCaseLabel: false,
                              labelStyle: styles.labelStyle,
                              indicatorStyle: styles.indicatorStyle,
                              style: {
                                  backgroundColor: theme.themeColor,
                              },
                          },
                          lazy: true,
                      }),
                  )
                : null;
        }
        return this.tabNav;
    }

    render() {
        const {theme} = this.props;
        const statusBar = {
            barStyle: 'light-content',
            hidden: false,
        };
        const navigationBar = (
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={theme.styles.navBar}
            />
        );

        const TabNavigator = this.generateTabNavigator();

        return (
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
                {this.renderTrendingDialog()}
            </View>
        );
    }
}

const mapTrendingStateToProps = (state) => ({
    languages: state.language.languages,
    theme: state.theme.theme,
});

const mapTrendingDispatchToProps = (dispatch) => ({
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(
    mapTrendingStateToProps,
    mapTrendingDispatchToProps,
)(TrendingPage);

class TopTrendingPage extends Component {
    constructor(props) {
        super(props);
        const {tabLabel, timeSpan} = props;
        this.tabName = tabLabel;
        this.timeSpan = timeSpan;
        this.favoriteDidChanged = false;
    }

    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(
            EventTypes.EVENT_TYPE_TIME_SPAN_CHANGED,
            (timeSpan) => {
                this.timeSpan = timeSpan;
                this.loadData();
            },
        );

        EventBus.getInstance().addListener(
            EventTypes.EVENT_TYPE_TRENDING_FAVORITE_CHANGE,
            (this.favoriteChangeListener = (data) => {
                this.favoriteDidChanged = true;
            }),
        );
        EventBus.getInstance().addListener(
            EventTypes.EVENT_TYPE_TAB_SELECT_CHANGE,
            (this.tabSelectChangeListener = (data) => {
                if (data.to === 'PopularPage' && this.favoriteDidChanged) {
                    this.favoriteDidChanged = false;
                    const store = this._store();
                    onFlushTrendingData(
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
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.tabSelectChangeListener);
    }

    urlWithStoreName(storeName) {
        return URL + storeName + '?' + this.timeSpan.searchText;
    }

    loadData(loadMore) {
        const {onLoadTrendingData, onLoadMoreTrending} = this.props;

        if (loadMore) {
            const store = this._store();
            onLoadMoreTrending(
                this.tabName,
                ++store.pageIndex,
                Setting.PAGESIZE,
                store.items,
                (callback) => {
                    this.refs.toast.show('没有更多了');
                },
            );
        } else {
            const url = this.urlWithStoreName(this.tabName);
            onLoadTrendingData(this.tabName, url, Setting.PAGESIZE);
        }
    }

    _store() {
        const {trending} = this.props;
        let store = trending[this.tabName];
        if (!store) {
            store = {
                items: [],
                projectModes: [],
                hideLoadingMore: true,
                isLoading: false,
            };
        }
        return store;
    }

    onSelect(data) {
        NavigationUtil.goPage(data, 'Detail');
    }

    onFavorite(item, isFavorite) {
        FavoriteService.updateFavorite(
            item,
            isFavorite,
            FLAG_PAGE.FLAG_PAGE_TRENDING,
        );
    }

    renderItem_(data) {
        return (
            <TrendingItem
                theme={this.props.theme}
                item={data}
                onFavorite={this.onFavorite}
                onSelect={(callback) => {
                    this.onSelect({
                        theme: this.props.theme,
                        type: FLAG_PAGE.FLAG_PAGE_TRENDING,
                        data: data,
                        callback,
                    });
                }}
            />
        );
    }

    generateIndicator_() {
        return this._store().hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator} />
                <Text>正在加载更多</Text>
            </View>
        );
    }

    render() {
        const store = this._store();
        const {theme} = this.props;
        return (
            <View>
                <FlatList
                    data={store.projectModes}
                    renderItem={(item) => this.renderItem_(item.item)}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                        />
                    }
                    ListFooterComponent={() => this.generateIndicator_()}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30.0,
    },
    tabStyle: {
        minWidth: 50,
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator: {
        color: 'red',
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: 'white',
    },
});

const mapStateToProps = (state) => ({
    trending: state.trending,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadTrendingData: (storeName, url, pageSize) =>
        dispatch(actions.onLoadTrendingData(storeName, url, pageSize)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, callback) =>
        dispatch(
            actions.onLoadMoreTrending(
                storeName,
                pageIndex,
                pageSize,
                dataArray,
                callback,
            ),
        ),
    onFlushTrendingData: (storeName, pageIndex, pageSize, items) =>
        dispatch(
            actions.onFlushTrendingData(storeName, pageIndex, pageSize, items),
        ),
});

const TopTrending = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopTrendingPage);
