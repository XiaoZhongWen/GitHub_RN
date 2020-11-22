import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModal from '../../modal/ProjectModal';
import Types from '../types';

export function onLoadFavoriteData(flag, isRefresh) {
    return (dispatch) => {
        if (isRefresh) {
            dispatch({
                type: Types.FAVORITE_REFRESH,
                favoriteName: flag,
            });
        }

        const favoriteDao = new FavoriteDao(flag);
        favoriteDao
            .getAllFavoriteItems()
            .then((data) => {
                let favoriteItems = [];
                const count = data.length;
                if (count) {
                    for (let index = 0; index < count; index++) {
                        const element = data[index];
                        favoriteItems.push(new ProjectModal(element, true));
                    }
                }
                dispatch({
                    type: Types.FAVORITE_REFRESH_SUCCESS,
                    favoriteName: flag,
                    items: favoriteItems,
                });
            })
            .catch((e) => {
                dispatch({
                    type: Types.FAVORITE_REFRESH_FAIL,
                    favoriteName: flag,
                });
            });
    };
}
