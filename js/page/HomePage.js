
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'

export default class HomePage extends Component {

    _tabNavigator() {
        return createAppContainer(createBottomTabNavigator({
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
        }));
    }

    render() {
        const Tab = this._tabNavigator();
        return <Tab />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});