import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme';
import {
    onLoadPopularData,
    onLoadMorePopular,
    onFlushPopularData,
} from './popular';
import {
    onLoadTrendingData,
    onLoadMoreTrending,
    onFlushTrendingData,
} from './Trending';
import {onLoadFavoriteData} from './Favorite';
import {onLoadLanguageData} from './Languages';
import {onLoadSearchData, onCancelSearch, onLoadMoreSearch} from './search';

export default {
    onThemeChange,
    onShowCustomThemeView,
    onThemeInit,
    onLoadPopularData,
    onLoadMorePopular,
    onLoadTrendingData,
    onLoadMoreTrending,
    onLoadFavoriteData,
    onFlushPopularData,
    onFlushTrendingData,
    onLoadLanguageData,
    onLoadSearchData,
    onCancelSearch,
    onLoadMoreSearch,
};
