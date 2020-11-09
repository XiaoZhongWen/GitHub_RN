import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class TrendingPage extends Component {

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
                    onPress={()=>{
                        navigation.setParams({
                            theme: {
                                tintColor: "orange",
                                updateTime: new Date().getTime()
                            }
                        });
                    }}
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