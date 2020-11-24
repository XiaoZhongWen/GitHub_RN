import React, {Component} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import Setting from '../common/setting';

export default class CheckBoxView extends Component {
    constructor(props) {
        super(props);
        const {items} = this.props.items;
        this.state = {
            items: items,
        };
    }

    _checkedImage(checked) {
        const {theme} = this.params;
        return (
            <Ionicons
                name={checked ? 'ios-checkbox' : 'md-square-outline'}
                size={20}
                style={{
                    color: Setting.THEME_COLOR,
                }}
            />
        );
    }

    renderItems(items, onChecked) {
        let views = [];
        for (let index = 0; index < items.length; index += 2) {
            const leftItem = items[index];
            const rightItem =
                index + 1 < items.length ? items[index + 1] : null;
            const view = (
                <View style={styles.checkBoxContainer}>
                    <CheckBox
                        style={{color: Setting.THEME_COLOR}}
                        onClick={() => onChecked(leftItem)}
                        isChecked={leftItem.checked}
                        checkedImage={this._checkedImage(true)}
                        unCheckedImage={this._checkedImage(false)}
                        leftText={leftItem.name}
                    />
                    {rightItem ? (
                        <CheckBox
                            style={{color: Setting.THEME_COLOR}}
                            onClick={() => onChecked(rightItem)}
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
        const items = this.state.items;
        const {onChecked} = this.props;
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
});
