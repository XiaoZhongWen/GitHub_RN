import React, { Component } from 'react';
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import actions from '../action';

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
                scrollEnabled: true,
                upperCaseLabel: false
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

    render() {
        return (
            <View>
                <Text>{this.tabName}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapDispatchToProps = dispatch => ({
    onLoadTrendingData: (storeName, url, pageSize) => dispatch(actions.onLoadTrendingData(storeName, url, pageSize))
});

const TopTrending = connect(null, mapDispatchToProps)(TopTrendingPage);

