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

class MyPage extends Component {
    onClick(menu) {}

    getItem(menu) {
        return ViewUtil.getMenuItem(menu, Setting.THEME_COLOR, () =>
            this.onClick(item),
        );
    }

    render() {
        const navigationBar = (
            <NavigationBar
                title={'我'}
                style={{backgroundColor: Setting.THEME_COLOR}}
            />
        );

        return (
            <View style={GlobalStyle.root_container}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.onClick(MENU.about)}>
                        <View style={styles.about}>
                            <Ionicons
                                name={MENU.About.icon}
                                size={40}
                                style={{
                                    marginRight: 10,
                                    color: Setting.THEME_COLOR,
                                }}
                            />
                            <Text>GitHub Popular</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginRight: 10,
                                color: Setting.THEME_COLOR,
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

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapDispatchToProps)(MyPage);
