
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DynamicTabNavigator from '../Navigator/DynamicTabNavigator'

export default class HomePage extends Component {

    render() {
        return <DynamicTabNavigator />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});