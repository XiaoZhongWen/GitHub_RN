import Types from '../../action/types';

const defaultAction = {};

export default function onAction(state = defaultAction, action) {
    switch (action.type) {
        case Types.FAVORITE_REFRESH:
            return {
                ...state,
                [action.favoriteName]: {
                    ...state[action.favoriteName],
                    isLoading: true,
                },
            };
        case Types.FAVORITE_REFRESH_SUCCESS:
            return {
                ...state,
                [action.favoriteName]: {
                    ...state[action.favoriteName],
                    items: action.items,
                    isLoading: false,
                },
            };
        case Types.FAVORITE_REFRESH_FAIL:
            return {
                ...state,
                [action.favoriteName]: {
                    ...state[action.favoriteName],
                    isLoading: false,
                },
            };
        default:
            return state;
    }
}
