import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

export default class PopularPage extends Component {

    render() {

        const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
            TopPopular1: {
                screen: TopPopular,
                navigationOptions: {
                    title: "top1"
                }
            },
            TopPopular2: {
                screen: TopPopular,
                navigationOptions: {
                    title: "top2"
                }
            }
        }));

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
                <Text>TopPopular</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
});