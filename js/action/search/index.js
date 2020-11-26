import Types from '../types';
import {wrapFavorite} from '../../service/ActionService';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import {FLAG_PAGE} from '../../expand/dao/DataStore';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
let CANCEL_TOKENS = [];

export function onLoadSearchData(searchKey, pageSize, token, callback) {
    return (dispatch) => {
        dispatch({
            type: Types.SEARCH_REFRESH,
        });
        const url = searchUrl(searchKey);
        fetch(url)
            .then((response) => {
                if (response.ok === true) {
                    return hasCancel(token) ? null : response.json();
                } else {
                    dispatch({
                        type: Types.SEARCH_REFRESH_FAIL,
                    });
                }
            })
            .then((responseData) => {
                if (hasCancel(token, true)) {
                    return null;
                }
                if (!responseData) {
                    callback(`没找到关于${inputKey}的项目`);
                    dispatch({
                        type: Types.SEARCH_REFRESH_FAIL,
                    });
                } else {
                    handlerData(dispatch, pageSize, responseData);
                }
            })
            .catch((e) => {
                dispatch({
                    type: Types.SEARCH_REFRESH_FAIL,
                });
            });
    };
}

export function onLoadMoreSearch(
    pageIndex,
    pageSize,
    dataArray = [],
    callback,
) {
    return (dispatch) => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more data');
                }
                dispatch({
                    type: Types.SEARCH_LOAD_MORE_FAIL,
                    error: 'no more',
                    pageIndex: --pageIndex,
                    projectModes: dataArray,
                });
            } else {
                let max =
                    pageSize * pageIndex > dataArray.length
                        ? dataArray.length
                        : pageSize * pageIndex;
                dispatch({
                    type: Types.SEARCH_LOAD_MORE_SUCCESS,
                    pageIndex: pageIndex,
                    projectModes: dataArray.slice(0, max),
                });
            }
        }, 500);
    };
}

export function onCancelSearch(token) {
    return (dispatch) => {
        CANCEL_TOKENS.push(token);
        dispatch({
            type: Types.SEARCH_CANCEL,
        });
    };
}

function handlerData(dispatch, pageSize, data) {
    let fixItems = [];
    if (data && data.items) {
        fixItems = data.items;
    }
    const favoriteDao = new FavoriteDao(FLAG_PAGE.FLAG_PAGE_POPULAR);
    const array = wrapFavorite(
        fixItems,
        FLAG_PAGE.FLAG_PAGE_POPULAR,
        favoriteDao,
        (result) => {
            dispatch({
                type: Types.SEARCH_REFRESH_SUCCESS,
                items: result,
                projectModes:
                    pageSize > result.length
                        ? result
                        : result.slice(0, pageSize),
            });
        },
    );
}

function searchUrl(searchKey) {
    return API_URL + searchKey + QUERY_STR;
}

function hasCancel(token, isRemove) {
    if (CANCEL_TOKENS.includes(token)) {
        if (isRemove) {
            for (i = 0; i < CANCEL_TOKENS.length; i++) {
                if (token === CANCEL_TOKENS[i]) {
                    CANCEL_TOKENS.splice(i, 1);
                }
            }
        }
        return true;
    }
    return false;
}
