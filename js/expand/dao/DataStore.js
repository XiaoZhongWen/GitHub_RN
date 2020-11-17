import { AsyncStorage } from 'react-native';
import Trending from 'GitHubTrending';

export const FLAG_PAGE = {
    FLAG_PAGE_POPULAR: 'popular',
    FLAG_PAGE_TRENDING: 'trending'
}

const token = "fd82d1e882462e23b8e88aa82198f166";

export default class DataStore {
    saveData(url, data, callback) {
        if (!data || !url) {
            return;
        }
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (error) {
                        reject(error);
                        console.log(error);
                    }
                } else {
                    reject(error);
                    console.log(error);
                }
            });
        });
    }

    fetchNetData(url, flag) {
        return new Promise((resolve, reject) => {
            if (flag === FLAG_PAGE.FLAG_PAGE_POPULAR) {
                fetch(url).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('network response is not ok.');
                    }
                }).then((responseData) => {
                    this.saveData(url, responseData);
                    resolve(responseData);
                }).catch((error) => {
                    reject(error);
                })
            } else {
                new Trending(token).fetchTrending(url).then(data => {
                    if (data.length) {
                        this.saveData(url, data);
                        resolve(data);
                    }
                }).catch(error => {
                    reject(error);
                })
            }
        });
    }

    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                } else {
                    this.fetchNetData(url, flag).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error);
                    })
                }
            }).catch((error) => {
                this.fetchNetData(url, flag).then((data) => {
                    resolve(this._wrapData(data));
                }).catch((error) => {
                    reject(error);
                });
            })
        });
    }

    _wrapData(data) {
        return {
            data: data,
            timestamp: (new Date()).getTime()
        }
    }

    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) {
            return false;
        }
        if (currentDate.getDate() != targetDate.getDate()) {
            return false;
        }
        if (currentDate.getHours() - targetDate.getHours() > 4) {
            return false;
        }
        return true;
    }
};