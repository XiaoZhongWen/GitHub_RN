import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import {connect} from 'react-redux';
import CheckBoxView from '../common/CheckBoxView';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import LanguagesDao, {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';
import actions from '../action';

class CustomLanguage extends Component {
    constructor(props) {
        super(props);
        const {onLoadLanguageData} = props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_language);
    }

    onChecked(languages) {
        const languagesDao = new LanguagesDao(FLAG_LANGUAGE.flag_language);
        languagesDao.save(languages);
        const {onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_language);
    }

    renderCheckBoxView() {
        const {languages} = this.props;
        if (languages && languages.length) {
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
            <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});