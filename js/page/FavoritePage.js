
import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import NavigationUtil from '../Navigator/NavigationUtil';

import { connect } from 'react-redux';

class FavoritePage extends Component {

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
                <Text>Favorite Page</Text>
                <Button
                    title="Detail"
                    onPress={() => {
                        NavigationUtil.goPage({from: "FavoritePage"}, "Detail");
                    }}
                />
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

});

export default connect(null, mapDispatchToProps)(FavoritePage)