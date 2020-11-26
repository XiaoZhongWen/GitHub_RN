import Types from '../../action/types';

const defaultState = {
    items: [],
    projectModes: [],
    hideLoadingMore: true,
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_REFRESH:
            return {
                ...state,
                isLoading: true,
                hideLoadingMore: true,
            };
        case Types.SEARCH_REFRESH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: true,
                items: action.items,
                projectModes: action.projectModes,
                pageIndex: 1,
            };
        case Types.SEARCH_REFRESH_FAIL:
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: true,
            };
        case Types.SEARCH_CANCEL:
            return {
                ...state,
                isLoading: false,
            };
        case Types.SEARCH_LOAD_MORE_SUCCESS:
            return {
                ...state,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
                projectModes: action.projectModes,
            };
        case Types.SEARCH_LOAD_MORE_FAIL:
            return {
                ...state,
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state;
    }
}
