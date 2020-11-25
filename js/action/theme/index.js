import Types from '../types';
import ThemeDao from '../../expand/dao/ThemeDao';

export function onThemeChange(theme) {
    return {
        type: Types.THEME_CHANGED,
        theme: theme,
    };
}
export function onShowCustomThemeView(show) {
    return {
        type: Types.SHOW_THEME_VIEW,
        customThemeViewVisible: show,
    };
}

export function onThemeInit() {
    return (dispatch) => {
        new ThemeDao().fetch().then((data) => {
            dispatch(onThemeChange(data));
        });
    };
}
