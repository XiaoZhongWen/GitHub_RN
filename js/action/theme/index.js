import Types from '../types'

export function onThemeChange(theme) {
    return {
        type: Types.THEME_CHANGED,
        theme: theme
    }
}