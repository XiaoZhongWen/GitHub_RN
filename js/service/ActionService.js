import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_PAGE} from '../expand/dao/DataStore';
import ProjectModal from '../modal/ProjectModal';

function isFavorite(item, keys, flag) {
    if (keys === null || keys.length === 0) {
        return false;
    }
    let key = '';
    switch (flag) {
        case FLAG_PAGE.FLAG_PAGE_POPULAR:
            key = item.id.toString();
            break;
        case FLAG_PAGE.FLAG_PAGE_TRENDING:
            key = item.fullName;
            break;
        default:
            break;
    }

    let isExist = false;
    for (let index = 0; index < keys.length; index++) {
        if (key.toLocaleLowerCase() === keys[index].toLocaleLowerCase()) {
            isExist = true;
            break;
        }
    }
    return isExist;
}

export async function wrapFavorite(items, flag, favoriteDao, callback) {
    let keys = [];
    try {
        keys = await favoriteDao.getFavoriteKeys();
    } catch (error) {
        console.log(error);
    }
    let projectModals = [];
    for (let index = 0; index < items.length; index++) {
        projectModals.push(
            new ProjectModal(
                items[index],
                isFavorite(items[index], keys, flag),
            ),
        );
    }
    if (typeof callback === 'function') {
        callback(projectModals);
    }
}
