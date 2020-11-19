import {AsyncStorage} from 'react-native';

const FAVORITE_PREFIX_KEY = 'favorite_';
export default class FavoriteDao {
    constructor(flag) {
        this.favoriteKey = FAVORITE_PREFIX_KEY + flag;
    }

    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }
}
