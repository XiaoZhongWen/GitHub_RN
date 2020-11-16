import { combineReducers } from 'redux';
import theme from './theme/index';
import popular from './popular/index';
import trending from './Trending/index';

const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending
});

export default index;