import Types from '../types';
import DataStore, {FLAG_PAGE} from '../../expand/dao/DataStore';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import {wrapFavorite} from '../../service/ActionService';

export function onLoadPopularData(storeName, url, pageSize) {
    return (dispatch) => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName: storeName,
        });
        const dataStore = new DataStore();
        dataStore
            .fetchData(url, FLAG_PAGE.FLAG_PAGE_POPULAR)
            .then((data) => {
                handleData(dispatch, data, storeName, pageSize);
            })
            .catch((error) => {
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName: storeName,
                    error: error,
                });
            });
    };
}

export function onLoadMorePopular(
    storeName,
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
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray,
                });
            } else {
                let max =
                    pageSize * pageIndex > dataArray.length
                        ? dataArray.length
                        : pageSize * pageIndex;
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName: storeName,
                    pageIndex: pageIndex,
                    projectModes: dataArray.slice(0, max),
                });
            }
        }, 500);
    };
}

export function onFlushPopularData(
    storeName,
    pageIndex,
    pageSize,
    dataArray = [],
) {
    let max =
        pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;

    return (dispatch) => {
        dispatch({
            type: Types.FLUSH_POPULAR_DATA,
            storeName: storeName,
            pageIndex: pageIndex,
            projectModes: dataArray.slice(0, max),
        });
    };
}

function handleData(dispatch, data, storeName, pageSize) {
    let fixItems = [];
    if (data && data.data && data.data.items) {
        fixItems = data.data.items;
    }
    const favoriteDao = new FavoriteDao(FLAG_PAGE.FLAG_PAGE_POPULAR);
    const array = wrapFavorite(
        fixItems,
        FLAG_PAGE.FLAG_PAGE_POPULAR,
        favoriteDao,
        (result) => {
            dispatch({
                type: Types.POPULAR_REFRESH_SUCCESS,
                items: result,
                projectModes:
                    pageSize > result.length
                        ? result
                        : result.slice(0, pageSize),
                storeName: storeName,
                pageIndex: 1,
            });
        },
    );
}
