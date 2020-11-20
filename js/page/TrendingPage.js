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
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import Setting from '../common/setting';
import {EVENT_TYPE_TIME_SPAN_CHANGED} from '../common/Event';
import actions from '../action';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import TimeSpan from '../modal/TimeSpan';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../Navigator/NavigationUtil';
import FavoriteService from '../service/FavoriteService';

const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.tabNames = ['All', 'Java', 'C', 'JavaScript', 'PHP'];
        this.state = {
            timeSpan: TimeSpans[0],
        };
    }

    generateTabs() {
        let tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: (props) => (
                    <TopTrending
                        {...props}
                        tabLabel={item}
                        timeSpan={this.state.timeSpan}
                    />
                ),
                navigationOptions: {
                    title: item,
                },
            };
        });
        return tabs;
    }

    onSelect(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab,
        });
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGED, tab);
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

    generateTabNavigator() {
        if (!this.tabNav) {
            this.tabNav = createAppContainer(
                createMaterialTopTabNavigator(this.generateTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        scrollEnabled: true,
                        upperCaseLabel: false,
                        labelStyle: styles.labelStyle,
                        indicatorStyle: styles.indicatorStyle,
                        style: {
                            backgroundColor: Setting.THEME_COLOR,
                        },
                    },
                }),
            );
        }
        return this.tabNav;
    }

    render() {
        const statusBar = {
            barStyle: 'light-content',
            hidden: false,
        };
        const navigationBar = (
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );

        const TabNavigator = this.generateTabNavigator();

        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator />
                {this.renderTrendingDialog()}
            </View>
        );
    }
}

class TopTrendingPage extends Component {
    constructor(props) {
        super(props);
        const {tabLabel, timeSpan} = props;
        this.tabName = tabLabel;
        this.timeSpan = timeSpan;
    }

    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(
            EVENT_TYPE_TIME_SPAN_CHANGED,
            (timeSpan) => {
                this.timeSpan = timeSpan;
                this.loadData();
            },
        );
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
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
                item={data}
                onFavorite={this.onFavorite}
                onSelect={(callback) => {
                    this.onSelect({
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
        return (
            <View>
                <FlatList
                    data={store.projectModes}
                    renderItem={(item) => this.renderItem_(item.item)}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={Setting.THEME_COLOR}
                            colors={[Setting.THEME_COLOR]}
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
});

const TopTrending = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopTrendingPage);
