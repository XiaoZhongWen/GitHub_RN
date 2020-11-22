import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
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

    static getSettingItem(Icons, icon, text, color, expandableIcon, callback) {
        return (
            <TouchableOpacity
                onPress={callback}
                style={styles.setting_item_container}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {Icons && icon ? (
                        <Icons
                            name={icon}
                            size={16}
                            style={{color: color, marginRight: 10}}
                        />
                    ) : (
                        <View
                            style={{
                                opacity: 1,
                                width: 16,
                                height: 16,
                                marginRight: 10,
                            }}></View>
                    )}
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        alignSelf: 'center',
                        color: color || 'black',
                    }}
                />
            </TouchableOpacity>
        );
    }

    static getMenuItem(menu, color, callback, expandableIcon) {
        return this.getSettingItem(
            menu.Icons,
            menu.icon,
            menu.name,
            color,
            expandableIcon,
            callback,
        );
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
