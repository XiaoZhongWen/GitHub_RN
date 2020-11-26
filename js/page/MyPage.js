import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';
import Setting from '../common/setting';
import {MENU} from '../common/MENU';
import GlobalStyle from '../common/GlobalStyle';
import ViewUtil from '../common/ViewUtil';
import NavigationUtil from '../Navigator/NavigationUtil';
import actions from '../action';

class MyPage extends Component {
    onClick(m) {
        const {theme} = this.props;
        let param = {theme: theme};
        let routeName;
        switch (m) {
            case MENU.Tutorial:
                routeName = 'WebPage';
                param.title = '教程';
                param.url =
                    'https://coding.m.imooc.com/classindex.html?cid=304';
                break;
            case MENU.About:
                routeName = 'AboutPage';
                break;
            case MENU.Custom_Language:
                routeName = 'CustomLanguage';
                break;
            case MENU.Custom_Key:
                routeName = 'CustomTag';
                break;
            case MENU.Sort_Language:
                routeName = 'CustomLanguageSort';
                break;
            case MENU.Sort_Key:
                routeName = 'CustomTagSort';
                break;
            case MENU.Custom_Theme:
                this.props.onShowCustomThemeView(true);
                return;
            default:
                break;
        }
        NavigationUtil.goPage(param, routeName);
    }

    getItem(menu) {
        return ViewUtil.getMenuItem(menu, this.props.theme.themeColor, () =>
            this.onClick(menu),
        );
    }

    render() {
        const {theme} = this.props;

        const navigationBar = (
            <NavigationBar title={'我'} style={theme.styles.navBar} />
        );

        return (
            <View style={GlobalStyle.root_container}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.onClick(MENU.About)}>
                        <View style={styles.about}>
                            <Ionicons
                                name={MENU.About.icon}
                                size={40}
                                style={{
                                    marginRight: 10,
                                    color: theme.themeColor,
                                }}
                            />
                            <Text>GitHub Popular</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginRight: 10,
                                color: theme.themeColor,
                            }}
                        />
                    </TouchableOpacity>
                    <View style={GlobalStyle.line} />
                    {this.getItem(MENU.Tutorial)}
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    {/*自定义语言*/}
                    {this.getItem(MENU.Custom_Language)}
                    {/*语言排序*/}
                    <View style={GlobalStyle.line} />
                    {this.getItem(MENU.Sort_Language)}

                    {/*最热管理*/}
                    <Text style={styles.groupTitle}>最热管理</Text>
                    {/*自定义标签*/}
                    {this.getItem(MENU.Custom_Key)}
                    {/*标签排序*/}
                    <View style={GlobalStyle.line} />
                    {this.getItem(MENU.Sort_Key)}
                    {/*标签移除*/}
                    <View style={GlobalStyle.line} />
                    {this.getItem(MENU.Remove_Key)}

                    {/*设置*/}
                    <Text style={styles.groupTitle}>设置</Text>
                    {/*自定义主题*/}
                    {this.getItem(MENU.Custom_Theme)}
                    {/*关于作者*/}
                    <View style={GlobalStyle.line} />
                    {this.getItem(MENU.About_Author)}
                    <View style={GlobalStyle.line} />
                    {/*反馈*/}
                    {this.getItem(MENU.Feedback)}
                    <View style={GlobalStyle.line} />
                    {this.getItem(MENU.CodePush)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    about: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray',
    },
});

const mapStateToDispatch = (state) => ({
    theme: state.theme.theme,
});

const mapDispatchToProps = (dispatch) => ({
    onShowCustomThemeView: (show) =>
        dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToDispatch, mapDispatchToProps)(MyPage);
