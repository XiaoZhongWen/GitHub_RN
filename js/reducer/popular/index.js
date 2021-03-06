import {act} from 'react-test-renderer';
import Types from '../../action/types';

const defaultState = {};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    isLoading: true,
                },
            };
        case Types.POPULAR_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    projectModes: action.projectModes,
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.POPULAR_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                },
            };
        case Types.POPULAR_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.POPULAR_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.FLUSH_POPULAR_DATA: {
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                },
            };
        }
        default:
            return state;
    }
}
