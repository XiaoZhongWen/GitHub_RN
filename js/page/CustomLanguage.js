import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import {connect} from 'react-redux';
import CheckBoxView from '../common/CheckBoxView';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';
import actions from '../action';

class CustomLanguage extends Component {
    constructor(props) {
        super(props);
        const {onLoadLanguageData} = props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_language);
    }

    onChecked(language) {
        console.log(language);
    }

    renderCheckBoxView() {
        const {languages} = this.props;
        if (languages) {
            return (
                <CheckBoxView
                    items={languages}
                    onChecked={(language) => this.onChecked(language)}
                />
            );
        } else {
            return null;
        }
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={'自定义语言'}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );
        return (
            <View>
                {navigationBar}
                {this.renderCheckBoxView()}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    languages: state.language.languages,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomLanguage);
