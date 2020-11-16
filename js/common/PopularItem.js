import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopularItem extends Component {
    render() {
        const { item } = this.props;
        if (!item || !item.owner) {
            return null;
        }
        return (
            <TouchableOpacity
                onPress={this.props.onSelect }
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.row}>
                        <View>
                            <Text>Author:</Text>
                            <Image
                                source={{uri:item.owner.avatar_url}}
                            />
                        </View>
                        <View style={styles.row}>
                            <Text>Start:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.favorite}
                            underlayColor={'transparent'}
                        >
                            <FontAwesome 
                                name={"star-o"}
                                size={26}
                                style={{color:'red'}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white', 
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray', 
        shadowOffset: {
            width: 0.5,
            height: 0.5
        },
        shadowOpacity: 0.4,
        shadowRadius: 1
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
    favorite: {
        padding: 6
    }
});