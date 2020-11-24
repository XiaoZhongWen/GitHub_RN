import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Platform} from 'react-native';
import SortableList from 'react-native-sortable-list';
import {connect} from 'react-redux';
import SortCell from '../common/SortCell';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import actions from '../action';
import LanguagesDao, {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';

const window = Dimensions.get('window');

class CustomLanguageSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedLanguages: CustomLanguageSort.getCheckedLanguages(props),
        };
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
                style={{backgroundColor: Setting.THEME_COLOR}}
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
                        console.log(nextOrder);
                    }}
                />
            </View>
        );
    }

    _renderRow = ({data, active}) => {
        return <SortCell data={data} active={active} />;
    };

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
