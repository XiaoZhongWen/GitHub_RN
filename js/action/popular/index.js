import Types from '../types';
import DataStore from "../../expand/dao/DataStore";

export function onLoadPopularData(storeName, url) {
    return dispatch => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName: storeName
        });
        const dataStore = new DataStore();
        dataStore.fetchData(url).then(data => {
            handleData(dispatch, data, storeName);
        }).catch(error => {
            dispatch({
                type: Types.LOAD_POPULAR_FAIL,
                storeName: storeName,
                error: error
            });
        })
    }
}

function handleData(dispatch, data, storeName) {
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        items: data && data.data && data.data.items,
        storeName: storeName
    });
}