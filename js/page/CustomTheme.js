import React, {Component} from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
} from 'react-native';
import {connect} from 'react-redux';
import ThemeService, {ThemeFlags} from '../service/ThemeService';
import ThemeDao from '../expand/dao/ThemeDao';
import actions from '../action';

class CustomTheme extends Component {
    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
    }

    onSelectItem(flag) {
        this.themeDao.save(ThemeFlags[flag]);
        const {onThemeChange} = this.props;
        onThemeChange(ThemeService.createTheme(ThemeFlags[flag]));
        this.props.onClose();
    }

    renderItem(flag) {
        return (
            <TouchableOpacity
                style={{flex: 1}}
                underlayColor="white"
                onPress={() => this.onSelectItem(flag)}>
                <View
                    style={[
                        {backgroundColor: ThemeFlags[flag]},
                        styles.themeItem,
                    ]}>
                    <Text>{flag}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderContentView() {
        let views = [];
        const keys = Object.keys(ThemeFlags);
        const count = keys.length;
        for (i = 0; i < count; i += 3) {
            let view = (
                <View style={styles.content} key={i}>
                    {this.renderItem(keys[i])}
                    {i + 1 < count ? this.renderItem(keys[i + 1]) : null}
                    {i + 2 < count ? this.renderItem(keys[i + 2]) : null}
                </View>
            );
            views.push(view);
        }
        return views;
    }

    render() {
        const {onClose} = this.props;
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={true}
                onRequestClose={() => onClose}>
                <ScrollView style={styles.container}>
                    {this.renderContentView()}
                </ScrollView>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});

export default connect(null, mapDispatchToProps)(CustomTheme);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3,
        margin: 10,
        marginBottom: 34,
        marginTop: 44,
    },
    content: {
        flexDirection: 'row',
    },
    themeItem: {
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
