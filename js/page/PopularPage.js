import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { exp } from 'react-native/Libraries/Animated/src/Easing';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import PopularItem from '../common/PopularItem';
import actions from '../action';
import NavigationBar from '../common/NavigationBar';

const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";
const THEME_COLOR = "#678";
const PAGESIZE = 10;

export default class PopularPage extends Component {

    constructor(props) {
        super(props);
        this.tabNames = ["Java", "iOS", "Android", "PHP", "React Native", "React"];
    }

    generateTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TopPopularPage {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs;
    }

    render() {

        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={"最热"}
            statusBar={statusBar}
            style={{
                backgroundColor:THEME_COLOR
            }}
        />

        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this.generateTabs(),{
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    scrollEnabled: true,
                    upperCaseLabel: false,
                    style: {
                        backgroundColor: THEME_COLOR
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        ));

        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator />
            </View>
        );
    }
}

class TopPopular extends Component {

    constructor(props) {
        super(props);
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(loadMore) {
        const { onLoadPopularData, onLoadMorePopular } = this.props;
        const store = this._store();
        const url = this.urlWithStoreName(this.storeName);
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, PAGESIZE, store.items, callback => {
                this.refs.toast.show("没有更多了");
            });
        } else {
            onLoadPopularData(this.storeName, url, PAGESIZE);
        }
    }

    _store() {
        const { popular } = this.props;
        let store = popular[this.storeName];
        if ( !store ) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                hideLoadingMore: true
            }
        }
        return store;
    }

    urlWithStoreName(storeName) {
        return URL + storeName + QUERY_STR;
    }

    onSelect() {
        
    }

    renderItem(data) {

        const item = data.item;
        return (
            <PopularItem item={item} onSelect={() => {
                this.onSelect();
            }} />
        );
    }

    generateIndicator() {
        return this._store().hideLoadingMore?null:
        <View style={styles.indicatorContainer}>
            <ActivityIndicator
                style={styles.indicator}
            />
            <Text>正在加载更多</Text>
        </View>
    }

    render() {
        const { popular } = this.props;
        let store = this._store();

        return (
            <View>
                <FlatList
                    data={store.projectModes}
                    renderItem={data=>this.renderItem(data)}
                    keyExtractor={item => "" + item.id}
                    refreshControl={
                        <RefreshControl
                            title={"loading"}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            titleColor={THEME_COLOR}
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

const mapStateToProps = state => ({
    popular: state.popular
});

const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url, pageSize) => dispatch(actions.onLoadPopularData(storeName, url, pageSize)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callback)),
});

const TopPopularPage = connect(mapStateToProps, mapDispatchToProps)(TopPopular);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    tabStyle:{
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: "white"
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
