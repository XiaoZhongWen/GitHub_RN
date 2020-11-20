import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../common/ViewUtil';
import NavigationUtil from '../Navigator/NavigationUtil';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import Setting from '../common/setting';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FavoriteService from '../service/FavoriteService';

const TRENDING_URL = 'https://github.com/';

export default class DetailPage extends Component {
    constructor(props) {
        super(props);
        this.params = props.navigation.state.params;

        switch (this.params.type) {
            case FLAG_PAGE.FLAG_PAGE_POPULAR:
                const link = this.params.data.item.html_url;
                this.state = {
                    title: this.params.data.item.full_name,
                    url: link,
                    canGoBack: false,
                    isFavorite: this.params.data.isFavorite,
                };
                break;
            case FLAG_PAGE.FLAG_PAGE_TRENDING:
                const url = TRENDING_URL + this.params.data.item.fullName;
                this.state = {
                    title: this.params.data.item.fullName,
                    url: url,
                    canGoBack: false,
                    isFavorite: this.params.data.isFavorite,
                };
                break;
            default:
                break;
        }
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigation.goBack();
        }
    }

    onFavorite() {
        this.params.data.isFavorite = !this.params.data.isFavorite;
        const {item, isFavorite} = this.params.data;
        const {type, callback} = this.params;
        callback(isFavorite);
        this.setState({
            isFavorite: isFavorite,
        });
        FavoriteService.updateFavorite(item, isFavorite, type);
    }

    renderRightButton() {
        return (
            <View style={styles.right}>
                <TouchableOpacity
                    underLayColor="transparent"
                    onPress={() => this.onFavorite()}>
                    <FontAwesome
                        name={this.state.isFavorite ? 'star' : 'star-o'}
                        size={20}
                        style={{
                            color: 'white',
                            marginRight: 10,
                            paddingVertical: 15,
                            paddingLeft: 10,
                        }}
                        color="white"
                    />
                </TouchableOpacity>
                {ViewUtil.shareButton()}
            </View>
        );
    }

    onNavigationStateChange(navigationState) {
        this.setState({
            canGoBack: navigationState.canGoBack,
            url: navigationState.url,
        });
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={this.state.title}
                leftButton={ViewUtil.leftButton(() => this.onBack())}
                rightButton={this.renderRightButton()}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );

        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={(webView) => (this.webView = webView)}
                    startInLoadingState={true}
                    onNavigationStateChange={(navigationState) =>
                        this.onNavigationStateChange(navigationState)
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
    right: {
        flexDirection: 'row',
    },
});
