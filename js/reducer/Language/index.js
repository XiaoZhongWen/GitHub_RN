import Types from '../../action/types';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguagesDao';

const defaultState = {
    keys: [],
    languages: [],
};
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS:
            if (action.flag === FLAG_LANGUAGE.flag_key) {
                return {
                    ...state,
                    keys: action.keys,
                };
            } else if (action.flag === FLAG_LANGUAGE.flag_language) {
                return {
                    ...state,
                    languages: action.languages,
                };
            } else {
                return state;
            }
            break;
        default:
            return state;
    }
}
