import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../Navigator/NavigationUtil';
import actions from '../action';
import {connect} from 'react-redux';

class WelcomePage extends Component {
    componentDidMount() {
        this.props.onThemeInit();
        this.timer = setTimeout(() => {
            NavigationUtil.resetToHomePage(this.props);
        }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome Page</Text>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
