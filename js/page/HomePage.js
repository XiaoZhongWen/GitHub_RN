import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import DynamicTabNavigator from '../Navigator/DynamicTabNavigator';
import NavigationUtil from '../Navigator/NavigationUtil';
import actions from '../action';
import CustomTheme from '../page/CustomTheme';

class HomePage extends Component {
    renderCustomThemeView() {
        const {customThemeViewVisible, onShowCustomThemeView} = this.props;
        if (customThemeViewVisible) {
            return <CustomTheme onClose={() => onShowCustomThemeView(false)} />;
        } else {
            return null;
        }
    }

    render() {
        NavigationUtil.navigation = this.props.navigation;
        return (
            <View style={styles.container}>
                <DynamicTabNavigator />
                {this.renderCustomThemeView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const mapStateToProps = (state) => ({
    customThemeViewVisible: state.theme.customThemeViewVisible,
});

const mapDispatchToProps = (dispatch) => ({
    onShowCustomThemeView: (show) =>
        dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
