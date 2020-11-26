import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import {connect} from 'react-redux';
import CheckBoxView from '../common/CheckBoxView';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import LanguagesDao, {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';
import actions from '../action';

class CustomTag extends Component {
    constructor(props) {
        super(props);
        const {theme} = props.navigation.state.params;
        this.theme = theme;
        const {onLoadLanguageData} = props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_key);
    }

    onChecked(keys) {
        const languagesDao = new LanguagesDao(FLAG_LANGUAGE.flag_key);
        languagesDao.save(keys);
        const {onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_key);
    }

    renderCheckBoxView() {
        const {keys} = this.props;
        if (keys && keys.length) {
            return (
                <CheckBoxView
                    theme={this.theme}
                    items={keys}
                    onChecked={(keys) => this.onChecked(keys)}
                />
            );
        } else {
            return null;
        }
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={'自定义标签'}
                style={this.theme.styles.navBar}
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
    keys: state.language.keys,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTag);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
