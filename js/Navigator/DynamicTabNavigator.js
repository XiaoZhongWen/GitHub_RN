import React, {Component} from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';

const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={"whatshot"}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: "趋势",
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={"md-trending-up"}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        },
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={"favorite"}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        },
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name={"user"}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        },
    }
};

export default class DynamicTabNavigator extends Component {

    _tabNavigator() {
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
        PopularPage.navigationOptions.tabBarLabel = "最热0";
        return createAppContainer(createBottomTabNavigator(
            tabs,
        ));
    }

    render () {
        const Tab = this._tabNavigator();
        return <Tab />;
    }

}