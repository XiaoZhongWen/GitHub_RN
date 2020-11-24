import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Platform} from 'react-native';
import SortableList from 'react-native-sortable-list';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SortCell from '../common/SortCell';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import actions from '../action';
import LanguagesDao, {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';

const window = Dimensions.get('window');

class CustomTagSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: CustomTagSort.getCheckedKeys(props),
        };
        this.order = [];
        this.languagesDao = new LanguagesDao(FLAG_LANGUAGE.flag_key);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedKeys = CustomTagSort.getCheckedKeys(nextProps, prevState);
        if (nextProps.keys !== checkedKeys) {
            return {
                checkedKeys: checkedKeys,
            };
        }
        return null;
    }

    componentDidMount() {
        if (CustomTagSort.getCheckedKeys(this.props).length === 0) {
            const {onLoadLanguageData} = this.props;
            onLoadLanguageData(FLAG_LANGUAGE.flag_key);
        }
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={'标签排序'}
                rightButton={this.renderRightButton()}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );

        return (
            <View style={styles.container}>
                {navigationBar}
                <SortableList
                    style={styles.list}
                    data={this.state.checkedKeys}
                    renderRow={this._renderRow}
                    onChangeOrder={(nextOrder) => {
                        this.order = nextOrder;
                    }}
                />
            </View>
        );
    }

    renderRightButton() {
        return (
            <TouchableOpacity
                style={{padding: 5, marginTop: 8}}
                onPress={() => this.onSave()}>
                <Text
                    style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                    保存
                </Text>
            </TouchableOpacity>
        );
    }

    _renderRow = ({data, active}) => {
        return <SortCell data={data} active={active} />;
    };

    onSave() {
        if (!this.order.length) {
            this.props.navigation.goBack();
            return;
        }
        let originOrder = [];
        let backup = [];
        for (let index = 0; index < this.props.keys.length; index++) {
            const element = this.props.keys[index];
            if (element.checked) {
                originOrder.push(index);
            }
            backup.push(element);
        }

        let newOrder = [];
        for (let index = 0; index < this.order.length; index++) {
            const element = this.order[index];
            const i = parseInt(element);
            newOrder.push(originOrder[i]);
        }

        for (let index = 0; index < newOrder.length; index++) {
            const order = newOrder[index];
            const item = this.props.keys[order];
            backup[originOrder[index]] = item;
        }

        this.languagesDao.save(backup);
        const {onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_key);
        this.props.navigation.goBack();
    }

    static getCheckedKeys(props, state) {
        if (state && state.checkedKeys && state.checkedKeys.length) {
            return state.checkedKeys;
        }

        const {keys} = props;
        let checkedKeys = [];
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            if (key.checked) {
                checkedKeys.push(key);
            }
        }
        return checkedKeys;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    list: {
        flex: 1,
    },
});

const mapStateToProps = (state) => ({
    keys: state.language.keys,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTagSort);
