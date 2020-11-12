import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import actions from '../action';

class TrendingPage extends Component {

    componentDidMount() {
        this.timer = setTimeout(() => {
            
        }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Button 
                    title="orange"
                    onPress={() => this.props.onThemeChange("orange")}
                />
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

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(null, mapDispatchToProps)(TrendingPage);