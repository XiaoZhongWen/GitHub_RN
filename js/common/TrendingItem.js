import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BaseItem, {renderFavoriteButton} from './BaseItem';

export default class TrendingItem extends BaseItem {
    render() {
        const {item, onSelect} = this.props;
        if (!item || !item.item) {
            return null;
        }
        const data = item.item;
        return (
            <TouchableOpacity
                onPress={() => this.onItemClick()}
                underLayColor="transparent">
                <View style={styles.container}>
                    {/* title */}
                    <View>
                        <Text style={styles.title}>{data.fullName}</Text>
                    </View>
                    {/* description */}
                    <View>
                        <Text style={styles.description}>
                            {data.description}
                        </Text>
                    </View>
                    {/* bottom */}
                    <View style={styles.row}>
                        {/* Authors */}
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            {data.contributors.map((url, index) => {
                                return (
                                    <Image key={index} source={{uri: url}} />
                                );
                            })}
                        </View>
                        {/* stars */}
                        <View>
                            <Text>{'stars:' + data.starCount}</Text>
                        </View>
                        {/* star icon */}
                        {this.renderFavoriteButton()}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 3,
        backgroundColor: 'white',
        padding: 10,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 1,
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
