import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    Easing,
    Dimensions,
    TouchableHighlight,
    StyleSheet,
    Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SortCell extends Component {
    constructor(props) {
        super(props);
        this._active = new Animated.Value(0);
        this._style = {
            ...Platform.select({
                ios: {
                    transform: [
                        {
                            scale: this._active.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.1],
                            }),
                        },
                    ],
                    shadowRadius: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 10],
                    }),
                },
                android: {
                    transform: [
                        {
                            scale: this._active.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.07],
                            }),
                        },
                    ],
                    elevation: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 6],
                    }),
                },
            }),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active) {
            Animated.timing(this._active, {
                duration: 300,
                easing: Easing.bounce,
                toValue: Number(nextProps.active),
            }).start();
        }
    }

    render() {
        const {data, active} = this.props;
        return (
            <Animated.View style={[styles.item, this._style]}>
                <TouchableHighlight underlayColor={'#eee'}>
                    <View style={{marginLeft: 10, flexDirection: 'row'}}>
                        <MaterialCommunityIcons
                            name={'sort'}
                            size={16}
                            style={{marginRight: 10}}
                        />
                        <Text>{this.props.data.name}</Text>
                    </View>
                </TouchableHighlight>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        paddingVertical: 20,
        color: '#999999',
    },
    text: {
        fontSize: 24,
        color: '#222222',
    },
    hidden: {
        height: 0,
    },
    item: {
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center',
    },
});
