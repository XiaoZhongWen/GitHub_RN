import React, {Component} from 'react';
import {StyleSheet, View, FlatList, RefreshControl} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import EventBus from 'react-native-event-bus';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../Navigator/NavigationUtil';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import Setting from '../common/setting';
import actions from '../action';
import FavoriteService from '../service/FavoriteService';
import EventTypes from '../common/Event';

import {connect} from 'react-redux';

export default class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.tabItems = [
            {
                type: FLAG_PAGE.FLAG_PAGE_POPULAR,
                name: '最热',
            },
            {
                type: FLAG_PAGE.FLAG_PAGE_TRENDING,
                name: '趋势',
            },
        ];
    }

    generateTabs() {
        let tabs = {};
        this.tabItems.forEach((tabItem) => {
            tabs[tabItem.type] = {
                screen: (props) => (
                    <TopFavoritePage {...props} type={tabItem.type} />
                ),
                navigationOptions: {
                    title: tabItem.name,
                },
            };
        });
        return tabs;
    }

    render() {
        const statusBar = {
            barStyle: 'light-content',
            hidden: false,
        };

        const TabNavigator = createAppContainer(
            createMaterialTopTabNavigator(this.generateTabs(), {
                tabBarOptions: {
                    style: {backgroundColor: Setting.THEME_COLOR},
                    labelStyle: styles.labelStyle,
                    indicatorStyle: {
                        backgroundColor: 'white',
                    },
                },
            }),
        );

        const navigationBar = (
            <NavigationBar
                title="收藏"
                statusBar={statusBar}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );

        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator />
            </View>
        );
    }
}

class TopFavorite extends Component {
    componentDidMount() {
        this.loadData(true);
        EventBus.getInstance().addListener(
            EventTypes.EVENT_TYPE_TAB_SELECT_CHANGE,
            (this.listener = (data) => {
                if (data.to === 'FavoritePage') {
                    this.loadData(false);
                }
            }),
        );
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    loadData(isRefresh) {
        const {onLoadFavoriteData, type} = this.props;
        onLoadFavoriteData(type, isRefresh);
    }

    _store() {
        const {favorite, type} = this.props;
        let store = favorite[type];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
            };
        }
        return store;
    }

    onFavorite(item, isFavorite, type) {
        FavoriteService.updateFavorite(item, isFavorite, this.props.type);
        if (type === FLAG_PAGE.FLAG_PAGE_POPULAR) {
            EventBus.getInstance().fireEvent(
                EventTypes.EVENT_TYPE_POPULAR_FAVORITE_CHANGE,
                {
                    item: item,
                    isFavorite: isFavorite,
                },
            );
        } else if (type === FLAG_PAGE.FLAG_PAGE_TRENDING) {
            EventBus.getInstance().fireEvent(
                EventTypes.EVENT_TYPE_TRENDING_FAVORITE_CHANGE,
            );
        }
    }

    onSelect(data) {
        NavigationUtil.goPage(data, 'Detail');
    }

    render() {
        let store = this._store();
        const {type} = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.items}
                    renderItem={(item) => {
                        return type === FLAG_PAGE.FLAG_PAGE_POPULAR ? (
                            <PopularItem
                                item={item.item}
                                onFavorite={(item, isFavorite) =>
                                    this.onFavorite(item, isFavorite, type)
                                }
                                onSelect={(callback) =>
                                    this.onSelect({
                                        type: type,
                                        data: item.item,
                                        callback,
                                    })
                                }
                            />
                        ) : (
                            <TrendingItem
                                item={item.item}
                                onFavorite={(item, isFavorite) =>
                                    this.onFavorite(item, isFavorite, type)
                                }
                                onSelect={(callback) =>
                                    this.onSelect({
                                        type: type,
                                        data: item.item,
                                        callback,
                                    })
                                }
                            />
                        );
                    }}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={Setting.THEME_COLOR}
                            colors={[Setting.THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                        />
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    },
});

const mapStateToProps = (state) => ({
    favorite: state.favorite,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadFavoriteData: (flag, isRefresh) =>
        dispatch(actions.onLoadFavoriteData(flag, isRefresh)),
});

const TopFavoritePage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopFavorite);
