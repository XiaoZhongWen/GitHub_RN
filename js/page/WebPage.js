import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../common/ViewUtil';
import Setting from '../common/setting';

export default class WebPage extends Component {
    constructor(props) {
        super(props);
        const {title, url} = props.navigation.state.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        };
    }

    onBack() {
        if (this.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigation.goBack();
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
        });
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={this.state.title}
                leftButton={ViewUtil.leftButton(() => this.onBack())}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );

        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={(webView) => {
                        this.webView = webView;
                    }}
                    startInLoadingState={true}
                    onNavigationStateChange={(e) =>
                        this.onNavigationStateChange(e)
                    }
                    source={{uri: this.state.url}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
