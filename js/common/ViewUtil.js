import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
    static leftButton(callback) {
        return (
            <TouchableOpacity
                underLayColor="transparent"
                onPress={callback}
                style={{padding: 10.0}}>
                <Ionicons
                    name={'ios-arrow-back'}
                    size={26}
                    style={{color: 'white'}}
                />
            </TouchableOpacity>
        );
    }

    static shareButton(callback) {
        return (
            <TouchableOpacity underLayColor={'transparent'} onPress={callback}>
                <Ionicons
                    name={'md-share'}
                    size={20}
                    style={{
                        color: 'white',
                        marginRight: 10,
                        paddingVertical: 13,
                    }}
                />
            </TouchableOpacity>
        );
    }
}
