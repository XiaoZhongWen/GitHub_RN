import React, {Component} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../modal/TimeSpan';

const TimeSpans = [new TimeSpan("今 天", "since=daily"), new TimeSpan("本 周", "since=weekly"), new TimeSpan("本 月", "since=monthly")];

export default class TrendingDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    show() {
        this.setState({
            visible: true
        });
    }

    dismiss() {
        this.setState({
            visible: false
        });
    }

    render() {
        const {onClose, onSelect} = this.props;
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => onClose}
            >
                <MaterialIcons
                    name={"arrow-drop-up"}
                    size={36}
                    color={'white'}
                />
                <View>
                    {
                        TimeSpans.map((timeSpan, index) => {
                            
                        })
                    }
                </View>
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => this.dismiss()}
                />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(0.0, 0.0, 0.0, 0.6)',
        alignItems: 'center'
    }
});