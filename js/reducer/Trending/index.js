import Types from '../../action/types';

const defaultAction = {};
export default function onAction(state = defaultAction, action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    isLoading: true,
                },
            };
        case Types.TRENDING_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: false,
                    isLoading: false,
                    items: action.items,
                    projectModes: action.projectModes,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    isLoading: false,
                },
            };
        case Types.TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                },
            };
        case Types.TRENDING_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                    hideLoadingMore: false,
                },
            };
        case Types.FLUSH_TRENDING_DATA:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                },
            };
        default:
            return state;
    }
}
