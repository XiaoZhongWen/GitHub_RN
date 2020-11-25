import React, {Component} from 'react';
import {View, FlatList, Text, TextInput, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../common/ViewUtil';

export default class SearchPage extends Component {
    constructor(props) {
        super(props);
    }

    onBack() {
        const {navigation} = this.props;
        navigation.goBack();
    }

    onSearch() {
        console.log('onSearch');
    }

    renderRightButton() {
        return (
            <TouchableOpacity
                style={{marginRight: 10, marginTop: 10, padding: 5}}
                onPress={() => this.onSearch()}>
                <Text style={{fontWeight: 'bold', color: 'white'}}>搜索</Text>
            </TouchableOpacity>
        );
    }

    renderTitleView() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 50,
                    width: 200,
                    height: 50,
                    backgroundColor: 'red',
                }}>
                <TextInput
                    style={{
                        position: 'relative',
                        flexDirection: 'row',
                        marginTop: 90,
                        width: 200,
                        height: 100,
                        backgroundColor: 'white',
                    }}
                    placeholder={'搜索'}
                    style={{backgroundColor: 'white'}}
                />
            </View>
        );
    }

    renderNavBar() {
        let inputView = (
            <TextInput
                ref="input"
                placeholderTextColor={'white'}
                placeholder={'搜索'}
                // onChangeText={text => this.inputKey = text}
                style={styles.textInput}></TextInput>
        );
        let rightButton = (
            <TouchableOpacity onPress={() => this.onSearch()}>
                <View style={{marginRight: 10}}>
                    <Text style={styles.title}>{'搜索'}</Text>
                </View>
            </TouchableOpacity>
        );
        return (
            <View
                style={{
                    // backgroundColor: theme.themeColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 44.0,
                    marginTop: 44.0,
                    backgroundColor: '#E91E63',
                }}>
                {ViewUtil.leftButton(() => this.onBack())}
                {inputView}
                {rightButton}
            </View>
        );
    }

    render() {
        const navigationBar = (
            <NavigationBar
                leftButton={ViewUtil.leftButton(() => this.onBack())}
                rightButton={this.renderRightButton()}
                titleView={this.renderTitleView()}
            />
        );

        return <View style={styles.container}>{this.renderNavBar()}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: Platform.OS === 'ios' ? 26 : 36,
        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },
    title: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
});
