import {combineReducers} from 'redux';
import theme from './theme/index';
import popular from './popular/index';
import trending from './Trending/index';
import favorite from './Favorite/index';
import language from './Language/index';
import search from './Search/index';

const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
    language: language,
    search: search,
});

export default index;
