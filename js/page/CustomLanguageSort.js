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

class CustomLanguageSort extends Component {
    constructor(props) {
        super(props);

        const {theme} = props.navigation.state.params;
        this.theme = theme;

        this.state = {
            checkedLanguages: CustomLanguageSort.getCheckedLanguages(props),
        };
        this.order = [];
        this.languagesDao = new LanguagesDao(FLAG_LANGUAGE.flag_language);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedLanguages = CustomLanguageSort.getCheckedLanguages(
            nextProps,
            prevState,
        );
        if (nextProps.languages !== checkedLanguages) {
            return {
                checkedLanguages: checkedLanguages,
            };
        }
        return null;
    }

    componentDidMount() {
        if (CustomLanguageSort.getCheckedLanguages(this.props).length === 0) {
            const {onLoadLanguageData} = this.props;
            onLoadLanguageData(FLAG_LANGUAGE.flag_language);
        }
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={'语言排序'}
                rightButton={this.renderRightButton()}
                style={this.theme.styles.navBar}
            />
        );

        return (
            <View style={styles.container}>
                {navigationBar}
                <SortableList
                    style={styles.list}
                    data={this.state.checkedLanguages}
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
        return <SortCell data={data} active={active} theme={this.theme} />;
    };

    onSave() {
        if (!this.order.length) {
            this.props.navigation.goBack();
            return;
        }
        let originOrder = [];
        let backup = [];
        for (let index = 0; index < this.props.languages.length; index++) {
            const element = this.props.languages[index];
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
            const item = this.props.languages[order];
            backup[originOrder[index]] = item;
        }

        this.languagesDao.save(backup);
        const {onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_language);
        this.props.navigation.goBack();
    }

    static getCheckedLanguages(props, state) {
        if (state && state.checkedLanguages && state.checkedLanguages.length) {
            return state.checkedLanguages;
        }

        const {languages} = props;
        let checkedLanguages = [];
        for (let index = 0; index < languages.length; index++) {
            const language = languages[index];
            if (language.checked) {
                checkedLanguages.push(language);
            }
        }
        return checkedLanguages;
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
    languages: state.language.languages,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomLanguageSort);
