import Types from '../types';
import DataStore, {FLAG_PAGE} from '../../expand/dao/DataStore';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import {wrapFavorite} from '../../service/ActionService';

export function onLoadTrendingData(storeName, url, pageSize) {
    return (dispatch) => {
        dispatch({
            type: Types.TRENDING_REFRESH,
            storeName: storeName,
        });
        const dataSource = new DataStore()
            .fetchData(url, FLAG_PAGE.FLAG_PAGE_TRENDING)
            .then((data) => {
                handleData(dispatch, data, storeName, pageSize);
            })
            .catch((error) => {
                dispatch({
                    type: Types.TRENDING_REFRESH_FAIL,
                    storeName: storeName,
                    error: error,
                });
            });
    };
}

export function onLoadMoreTrending(
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
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: pageIndex--,
                    projectModes: dataArray,
                });
            } else {
                const max =
                    pageIndex * pageSize >= dataArray.length
                        ? dataArray.length
                        : pageIndex * pageSize;
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName: storeName,
                    pageIndex: pageIndex,
                    projectModes: dataArray.slice(0, max),
                });
            }
        }, 500);
    };
}

function handleData(dispatch, data, storeName, pageSize) {
    let fixItems = [];
    if (data && data.data) {
        fixItems = data.data;
    }

    const favoriteDao = new FavoriteDao(FLAG_PAGE.FLAG_PAGE_TRENDING);
    wrapFavorite(
        fixItems,
        FLAG_PAGE.FLAG_PAGE_TRENDING,
        favoriteDao,
        (result) => {
            dispatch({
                type: Types.TRENDING_REFRESH_SUCCESS,
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
