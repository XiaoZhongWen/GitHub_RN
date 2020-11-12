import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { exp } from 'react-native/Libraries/Animated/src/Easing';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { connect } from 'react-redux';

class PopularPage extends Component {

    constructor(props) {
        super(props);
        this.tabNames = ["Java", "iOS", "Android", "PHP", "React Native", "React"];
    }

    generateTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TopPopular {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs;
    }

    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this.generateTabs(),{
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    scrollEnabled: true,
                    upperCaseLabel: false,
                    style: {
                        backgroundColor: "#a67"
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        ));

        return (
            <View style={styles.container}>
                <TabNavigator />
            </View>
        );
    }
}

class TopPopular extends Component {
    render() {
        return (
            <View>
                <Text>{this.props.tabLabel}</Text>
            </View>
        );
    }
}

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
    }
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapDispatchToProps)(PopularPage)