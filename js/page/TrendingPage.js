import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class TrendingPage extends Component {

    componentDidMount() {
        this.timer = setTimeout(() => {
            
        }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Trending Page</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});