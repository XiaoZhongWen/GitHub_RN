import LanguagesDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguagesDao';
import Types from '../types';

export function onLoadLanguageData(flag) {
    return (dispatch) => {
        const languagesDao = new LanguagesDao(flag);
        languagesDao
            .fetch()
            .then((data) => {
                switch (flag) {
                    case FLAG_LANGUAGE.flag_key:
                        dispatch({
                            type: Types.LANGUAGE_LOAD_SUCCESS,
                            flag: flag,
                            keys: data,
                        });
                        break;
                    case FLAG_LANGUAGE.flag_language:
                        dispatch({
                            type: Types.LANGUAGE_LOAD_SUCCESS,
                            flag: flag,
                            languages: data,
                        });
                        break;
                    default:
                        break;
                }
            })
            .catch((error) => {});
    };
}
