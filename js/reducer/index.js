import { combineReducers } from 'redux';
import theme from './theme/index';
import popular from './popular/index';

const index = combineReducers({
    theme: theme,
    popular: popular
});

export default index;