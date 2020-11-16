import Types from '../../action/types';

const defaultAction = {};
export default function onAction(state = defaultAction, action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH:
            return ({
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    isLoading: true
                }
            });
        default:
            return state;
    }
}