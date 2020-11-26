import React, {Component} from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import ViewUtil from '../common/ViewUtil';
import Setting from '../common/setting';
import PopularItem from '../common/PopularItem';
import NavigationUtil from '../Navigator/NavigationUtil';
import actions from '../action';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import FavoriteService from '../service/FavoriteService';
import LanguagesDao, {FLAG_LANGUAGE} from '../expand/dao/LanguagesDao';

class SearchPage extends Component {
    constructor(props) {
        super(props);
        const {theme, keys} = this.props.navigation.state.params;
        this.theme = theme;
        this.keys = keys;
        this.inputKey = '';
        this.favoriteKey = '';
        this.addFavorite = false;
        this.languagesDao = new FavoriteDao(FLAG_LANGUAGE.flag_key);
    }

    onBack() {
        this.refs.input.blur();
        const {navigation, onLoadLanguageData} = this.props;
        onLoadLanguageData(FLAG_LANGUAGE.flag_key);
        navigation.goBack();
    }

    onSearch() {
        if (!this.inputKey.length) {
            this.toast.show('请输入搜索关键字');
        } else {
            const {isLoading} = this.props.search;
            if (isLoading) {
                this.props.onCancelSearch(this.token);
                return;
            }
            this.refs.input.blur();
            this.favoriteKey = this.inputKey;
            const {onLoadSearchData} = this.props;
            onLoadSearchData(
                this.favoriteKey,
                Setting.PAGESIZE,
                (this.token = new Date().getTime().toString()),
                (message) => {
                    this.toast.show(message);
                },
            );
        }
    }

    renderNavBar() {
        const {isLoading} = this.props.search;
        let inputView = (
            <TextInput
                ref="input"
                placeholderTextColor={'white'}
                placeholder={'搜索'}
                onChangeText={(text) => (this.inputKey = text)}
                style={styles.textInput}></TextInput>
        );
        let rightButton = (
            <TouchableOpacity onPress={() => this.onSearch()}>
                <View style={{marginRight: 10}}>
                    <Text style={styles.title}>
                        {isLoading ? '取消' : '搜索'}
                    </Text>
                </View>
            </TouchableOpacity>
        );

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 44.0,
                    marginTop: 44.0,
                    backgroundColor: this.theme.themeColor,
                }}>
                {ViewUtil.leftButton(() => this.onBack())}
                {inputView}
                {rightButton}
            </View>
        );
    }

    isFavorite_() {
        let isFavorite = false;
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            if (
                this.favoriteKey.toLowerCase().trim() ===
                key.name.toLowerCase().trim()
            ) {
                isFavorite = true;
                break;
            }
        }
        return isFavorite;
    }

    renderBottomButton() {
        if (
            !this.favoriteKey.length ||
            this.props.search.isLoading ||
            this.isFavorite_()
        ) {
            return null;
        } else {
            return (
                <TouchableOpacity
                    style={[
                        styles.bottomButton,
                        {backgroundColor: this.theme.themeColor},
                    ]}
                    onPress={() => this.onSave()}>
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 16,
                        }}>
                        加入标签
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    onSelect(data) {
        NavigationUtil.goPage(data, 'Detail');
    }

    onFavorite(item, isFavorite) {
        FavoriteService.updateFavorite(
            item,
            isFavorite,
            FLAG_PAGE.FLAG_PAGE_POPULAR,
        );
    }

    onSave() {
        if (this.isFavorite_()) {
            this.toast.show(this.favoriteKey + '已经存在');
        } else {
            key = {
                path: this.favoriteKey,
                name: this.favoriteKey,
                checked: true,
            };
            const {keys} = this.props;
            keys.unshft(key);
            this.languagesDao.save(keys);
            this.addFavorite = true;
            this.toast.show('添加成功');
        }
    }

    renderItem(data) {
        return (
            <PopularItem
                item={data}
                theme={this.theme}
                onFavorite={this.onFavorite}
                onSelect={(callback) => {
                    this.onSelect({
                        theme: this.theme,
                        type: FLAG_PAGE.FLAG_PAGE_POPULAR,
                        data: data,
                        callback,
                    });
                }}
            />
        );
    }

    renderContentView() {
        const isFavorite = this.isFavorite_();
        const {isLoading, projectModes} = this.props.search;
        if (isLoading) {
            return (
                <ActivityIndicator
                    animating={true}
                    color={this.theme.themeColor}
                    size={'large'}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                />
            );
        } else if (this.favoriteKey.length) {
            return (
                <FlatList
                    style={isFavorite ? {} : styles.flatList}
                    data={projectModes}
                    renderItem={(item) => this.renderItem(item.item)}
                    keyExtractor={(item) => '' + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={this.theme.themeColor}
                            colors={[this.theme.themeColor]}
                            refreshing={isLoading}
                            onRefresh={() => this.loadData()}
                        />
                    }
                    ListFooterComponent={() => this.generateIndicator()}
                    onEndReached={() => {
                        this.loadData(true);
                    }}
                    onEndReachedThreshold={0.5}
                />
            );
        } else {
            return null;
        }
    }

    generateIndicator() {
        const {hideLoadingMore} = this.props.search;
        return hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator color={this.theme.themeColor} />
                <Text>正在加载更多</Text>
            </View>
        );
    }

    loadData(flag) {
        const {onLoadSearchData, onLoadMoreSearch, search} = this.props;
        if (flag) {
            onLoadMoreSearch(
                search.pageIndex + 1,
                Setting.PAGESIZE,
                search.items,
                (message) => {
                    this.toast.show(message);
                },
            );
        } else {
            onLoadSearchData(
                this.favoriteKey,
                Setting.PAGESIZE,
                (this.token = new Date.getTime().toString()),
                (message) => {
                    this.toast.show(message);
                },
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                {this.renderContentView()}
                {this.renderBottomButton()}
                <Toast
                    ref={(toast) => (this.toast = toast)}
                    position="center"
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    search: state.search,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadSearchData: (searchKey, pageSize, token, callback) =>
        dispatch(
            actions.onLoadSearchData(searchKey, pageSize, token, callback),
        ),
    onCancelSearch: (token) => dispatch(actions.onCancelSearch(token)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, callback) =>
        dispatch(
            actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, callback),
        ),
    onLoadLanguageData: (flag) => dispatch(actions.onLoadLanguageData(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: Platform.OS === 'ios' ? 26 : 36,
        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },
    title: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    toast: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 30,
        left: 20,
        right: 20,
        height: 45,
        borderRadius: 5,
    },
    flatList: {
        marginBottom: 72,
    },
    indicatorContainer: {
        alignItems: 'center',
    },
});
