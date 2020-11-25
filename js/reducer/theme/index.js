import Types from '../../action/types';
import ThemeService, {ThemeFlags} from '../../service/ThemeService';

const defaultState = {
    theme: ThemeService.createTheme(ThemeFlags.Default),
    customThemeViewVisible: false,
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.THEME_CHANGED:
            return {
                ...state,
                theme: action.theme,
            };
        case Types.SHOW_THEME_VIEW:
            return {
                ...state,
                customThemeViewVisible: action.customThemeViewVisible,
            };
        default:
            return state;
    }
}
