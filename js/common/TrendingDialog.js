import React, {Component} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../modal/TimeSpan';

export const TimeSpans = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly'),
];

export default class TrendingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    show() {
        this.setState({
            visible: true,
        });
    }

    dismiss() {
        this.setState({
            visible: false,
        });
    }

    render() {
        const {onClose, onSelect} = this.props;
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => onClose}>
                <TouchableOpacity
                    underlayColor="transparent"
                    style={styles.container}
                    onPress={() => this.dismiss()}>
                    <MaterialIcons
                        name={'arrow-drop-up'}
                        size={36}
                        color={'white'}
                        style={styles.arrow}
                    />
                    <View style={styles.content}>
                        {TimeSpans.map((timeSpan, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    underlayColor="transparent"
                                    onPress={() => onSelect(timeSpan)}>
                                    <View style={styles.text_container}>
                                        <Text style={styles.text}>
                                            {timeSpan.showText}
                                        </Text>
                                        {index !== TimeSpans.length - 1 ? (
                                            <View style={styles.line} />
                                        ) : null}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.6)',
        alignItems: 'center',
    },
    arrow: {
        marginTop: 70.0,
        color: 'white',
        padding: 0,
        margin: -18,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        marginTop: 3,
        marginBottom: 3,
        marginRight: 3,
    },
    text_container: {
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26,
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray',
    },
});
