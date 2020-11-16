import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

export function onLoadTrendingData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({
            type: Types.TRENDING_REFRESH,
            storeName: storeName
        });
    };
}