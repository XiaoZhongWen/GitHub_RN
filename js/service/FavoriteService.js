import {FLAG_PAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';

const favoriteDao_popular = new FavoriteDao(FLAG_PAGE.FLAG_PAGE_POPULAR);
const favoriteDao_trending = new FavoriteDao(FLAG_PAGE.FLAG_PAGE_TRENDING);

export default class FavoriteService {
    static updateFavorite(item, isFavorite, flag) {
        let favoriteDao = null;
        let key = null;
        switch (flag) {
            case FLAG_PAGE.FLAG_PAGE_POPULAR:
                favoriteDao = favoriteDao_popular;
                key = item.id.toString();
                break;
            case FLAG_PAGE.FLAG_PAGE_TRENDING:
                favoriteDao = favoriteDao_trending;
                key = item.fullName;
                break;
            default:
                break;
        }
        if (favoriteDao === null || key === null) {
            return;
        }
        favoriteDao.setFavorite(key, item);
    }
}
