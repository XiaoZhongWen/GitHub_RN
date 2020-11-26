import React, {Component} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Setting from '../common/setting';

export default class CheckBoxView extends Component {
    constructor(props) {
        super(props);
        // const {items} = this.props;
        // this.state = {
        //     items: items,
        // };
        const {theme} = this.props;
        this.theme = theme;
    }

    _checkedImage(checked) {
        return (
            <Ionicons
                name={checked ? 'ios-checkbox' : 'md-square-outline'}
                size={20}
                style={{
                    color: this.theme.themeColor,
                }}
            />
        );
    }

    onChecked(item) {
        let items = this.props.items;
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            if (element === item) {
                item.checked = !item.checked;
                // this.setState({
                //     items: items,
                // });
                this.props.onChecked(items);
                break;
            }
        }
    }

    renderItems(items, onChecked) {
        let views = [];
        for (let index = 0; index < items.length; index += 2) {
            const leftItem = items[index];
            const rightItem =
                index + 1 < items.length ? items[index + 1] : null;
            const view = (
                <View key={index} style={styles.checkBoxContainer}>
                    <CheckBox
                        style={styles.checkBox}
                        onClick={() => this.onChecked(leftItem)}
                        isChecked={leftItem.checked}
                        checkedImage={this._checkedImage(true)}
                        unCheckedImage={this._checkedImage(false)}
                        leftText={leftItem.name}
                    />
                    {rightItem ? (
                        <CheckBox
                            style={styles.checkBox}
                            onClick={() => this.onChecked(rightItem)}
                            isChecked={rightItem.checked}
                            checkedImage={this._checkedImage(true)}
                            unCheckedImage={this._checkedImage(false)}
                            leftText={rightItem.name}
                        />
                    ) : null}
                </View>
            );
            views.push(view);
        }
        return views;
    }

    render() {
        const {onChecked, items} = this.props;
        return (
            <ScrollView style={styles.container}>
                {this.renderItems(items, onChecked)}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
    checkBox: {
        flex: 1,
        padding: 10,
    },
});
