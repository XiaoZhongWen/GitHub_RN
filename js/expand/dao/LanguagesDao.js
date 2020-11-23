import {AsyncStorage} from 'react-native';
import keys from '../../keys.json';
import langs from '../../langs.json';

export const FLAG_LANGUAGE = {
    flag_key: 'language_dao_key',
    flag_language: 'language_dao_language',
};
export default class LanguagesDao {
    constructor(flag) {
        this.flag = flag;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (!error) {
                    if (result) {
                        try {
                            const data = JSON.parse(result);
                            resolve(data);
                        } catch (error) {
                            reject(error);
                            console.log(error);
                        }
                    } else {
                        const data =
                            this.flag === FLAG_LANGUAGE.flag_key ? keys : langs;
                        resolve(data);
                        this.save(data);
                    }
                } else {
                    reject(error);
                    console.log(error);
                }
            });
        });
    }

    save(data) {
        AsyncStorage.setItem(this.flag, JSON.stringify(data), (error) => {
            console.log(error);
        });
    }
}
