import React, { Component } from 'react';
import { Button, Settings, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import Setting from '../common/setting';
import actions from '../action';
import { State } from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast';

const URL = "https://github.com/trending/";
const QUERY_STR = "?since=daily";

export default class TrendingPage extends Component {

    constructor(props) {
        super(props);
        this.tabNames = ["All", "Java", "C", "JavaScript", "PHP"];
    }

    generateTabs() {
        let tabs = {};
        this.tabNames.forEach((item ,index) => {
            tabs[`tab${index}`] = {
                screen: props => <TopTrending {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs;
    }

    render() {
        const statusBar = {
            barStyle:"light-content",
            hidden: false
        }
        const navigationBar = <NavigationBar 
            title={"趋势"}
            statusBar={statusBar}
            style={{backgroundColor: Setting.THEME_COLOR}}
        />

        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(this.generateTabs(),{
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                scrollEnabled: true,
                upperCaseLabel: false,
                labelStyle: styles.labelStyle,
                indicatorStyle: styles.indicatorStyle,
                style: {
                    backgroundColor: Setting.THEME_COLOR
                }
            }
        }));

        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator />
            </View>
        );
    }
}

class TopTrendingPage extends Component {

    constructor(props) {
        super(props);
        const { tabLabel } = props;
        this.tabName = tabLabel;
    }

    componentDidMount() {
        this.loadData();
    }

    urlWithStoreName(storeName) {
        return URL + storeName + QUERY_STR;
    }

    loadData(loadMore) {
        const { onLoadTrendingData, onLoadMoreTrending } = this.props;
        
        if (loadMore) {
            const store = this._store();
            onLoadMoreTrending(this.tabName, ++store.pageIndex, Setting.PAGESIZE, store.items, callback => {
                this.refs.toast.show("没有更多了");
            });
        } else {
            const url = this.urlWithStoreName(this.tabName);
            onLoadTrendingData(this.tabName, url, Setting.PAGESIZE);
        }
    }

    _store() {
        const { trending } = this.props;
        let store = trending[this.tabName];
        if (!store) {
            store = {
                items: [],
                projectModes: [],
                hideLoadingMore: true,
                isLoading: false
            }
        }
        return store;
    }

    renderItem_(data) {
        const item = data.item;
        return <TrendingItem item={item} />
    }

    generateIndicator_() {
        return this._store().hideLoadingMore?null:
        <View style={styles.indicatorContainer}>
            <ActivityIndicator style={styles.indicator} />
            <Text>正在加载更多</Text>
        </View>
    }

    render() {
        const store = this._store();
        return (
            <View>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this.renderItem_(data)}
                    refreshControl={
                        <RefreshControl
                            title={"loading"}
                            titleColor={Setting.THEME_COLOR}
                            colors={[Setting.THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                        />
                    }
                    ListFooterComponent={() => this.generateIndicator_()}
                    onEndReached={() => {
                        this.loadData(true)
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
        flex: 1
    },
    tabStyle: {
        minWidth: 50
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator:{
        color: 'red',
        margin: 10
    }
});

const mapStateToProps = state => ({
    trending: state.trending
});

const mapDispatchToProps = dispatch => ({
    onLoadTrendingData: (storeName, url, pageSize) => dispatch(actions.onLoadTrendingData(storeName, url, pageSize)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, callback))
});

const TopTrending = connect(mapStateToProps, mapDispatchToProps)(TopTrendingPage);

