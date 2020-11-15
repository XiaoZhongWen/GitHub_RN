import Types from '../types';
import DataStore from "../../expand/dao/DataStore";

export function onLoadPopularData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName: storeName
        });
        const dataStore = new DataStore();
        dataStore.fetchData(url).then(data => {
            handleData(dispatch, data, storeName, pageSize);
        }).catch(error => {
            dispatch({
                type: Types.POPULAR_REFRESH_FAIL,
                storeName: storeName,
                error: error
            });
        })
    }
}

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callback) {
    return dispatch => {
        setTimeout(() => {
            if ( (pageIndex - 1) * pageSize >= dataArray.length ) {
                if (typeof callback === 'function') {
                    callback('no more data');
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray
                });
            } else {
                let max = pageSize * pageIndex > dataArray.length? dataArray.length: pageSize * pageIndex;
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName: storeName,
                    pageIndex: pageIndex,
                    projectModes: dataArray.slice(0, max)
                });
            }
        }, 500);
    }
}

function handleData(dispatch, data, storeName, pageSize) {

    let fixItems = [];
    if (data && data.data && data.data.items) {
        fixItems = data.data.items;
    }

    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        items:fixItems,
        projectModes: pageSize > fixItems.length? fixItems:fixItems.slice(0, pageSize),
        storeName: storeName,
        pageIndex: 1
    });
}