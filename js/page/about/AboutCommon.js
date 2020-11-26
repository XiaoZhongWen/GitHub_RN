import React, {Component} from 'react';
import {View, Image, Text, Dimensions, StyleSheet} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import config from '../../config.json';
import ViewUtil from '../../common/ViewUtil';
import NavigationUtil from '../../Navigator/NavigationUtil';

export default class AboutCommon extends Component {
    constructor(props) {
        super(props);
        const {theme} = props.navigation.state.params;
        this.theme = theme;
    }

    getParallaxRenderConfig(params) {
        let config = {};
        config.renderBackground = () => (
            <View key="background">
                <Image
                    source={{
                        uri: params.backgroundImage,
                        width: window.width,
                        height: PARALLAX_HEADER_HEIGHT,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: window.width,
                        backgroundColor: 'rgba(0,0,0,.4)',
                        height: PARALLAX_HEADER_HEIGHT,
                    }}
                />
            </View>
        );

        let avatar =
            typeof params.avatar === 'string'
                ? {uri: params.avatar}
                : params.avatar;
        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image
                    style={styles.avatar}
                    source={{
                        avatar,
                    }}
                />
                <Text style={styles.sectionSpeakerText}>{params.name}</Text>
                <Text style={styles.sectionTitleText}>
                    {params.descripation}
                </Text>
            </View>
        );

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );

        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.leftButton()}
                {ViewUtil.shareButton()}
            </View>
        );

        return config;
    }

    render(contentView, params) {
        const renderConfig = this.getParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
                backgroundColor={'#678'}
                contentBackgroundColor={'#f3f3f4'}
                parallaxHeaderHeight={270.0}
                stickyHeaderHeight={44.0}
                backgroundScrollSpeed={10}
                {...renderConfig}>
                {contentView}
            </ParallaxScrollView>
        );
    }
}

const window = new Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT = 64;
const TOP = 44.0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT,
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        alignItems: 'center',
        paddingTop: TOP,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10,
    },
    fixedSection: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: TOP,
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20,
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100,
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2,
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5,
        marginBottom: 10,
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
        marginLeft: 10,
    },
});
