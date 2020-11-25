import {element} from 'prop-types';
import {AsyncStorage} from 'react-native';

const FAVORITE_PREFIX_KEY = 'favorite_';
export default class FavoriteDao {
    constructor(flag) {
        this.favoriteKey = FAVORITE_PREFIX_KEY + flag;
    }

    setFavorite(key, item) {
        AsyncStorage.setItem(key, JSON.stringify(item), (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, true);
            }
        });
    }

    removeFavorite(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        });
    }

    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                const index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                } else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1);
                    }
                }
                AsyncStorage.setItem(
                    this.favoriteKey,
                    JSON.stringify(favoriteKeys),
                );
            }
        });
    }

    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        if (result) {
                            resolve(JSON.parse(result));
                        } else {
                            resolve([]);
                        }
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }

    getAllFavoriteItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys()
                .then((keys) => {
                    AsyncStorage.multiGet(keys, (error, result) => {
                        if (!error) {
                            let items = [];
                            result.map((value) => {
                                const item = value[1];
                                items.push(JSON.parse(item));
                            });
                            resolve(items);
                        } else {
                            reject(error);
                        }
                    });
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}
