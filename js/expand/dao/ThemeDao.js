import {AsyncStorage} from 'react-native';
import ThemeService, {ThemeFlags} from '../../service/ThemeService';

const key = '_ThemeDao_';
export default class ThemeDao {
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                let flag = result;
                if (error || !result) {
                    flag = ThemeFlags.Default;
                    this.save(flag);
                }
                resolve(ThemeService.createTheme(flag));
            });
        });
    }

    save(themeFlag) {
        AsyncStorage.setItem(key, themeFlag, (error) => {
            console.log(error);
        });
    }
}
