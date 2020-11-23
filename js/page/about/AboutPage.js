import React, {Component} from 'react';
import {View} from 'react-native';
import AboutCommon from './AboutCommon';
import config from '../../config.json';
import ViewUtil from '../../common/ViewUtil';
import Setting from '../../common/setting';
import {MENU} from '../../common/MENU';
import GlobalStyle from '../../common/GlobalStyle';

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(this.props);
    }

    render() {
        const contentView = (
            <View>
                {ViewUtil.getMenuItem(MENU.Tutorial)}
                <View style={GlobalStyle.line} />
                {ViewUtil.getMenuItem(MENU.About_Author)}
                <View style={GlobalStyle.line} />
                {ViewUtil.getMenuItem(MENU.Feedback)}
                <View style={GlobalStyle.line} />
            </View>
        );
        return this.aboutCommon.render(contentView, config.app);
    }
}
