import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebPage from '../page/WebPage';
import AboutPage from '../page/about/AboutPage';
import CustomLanguage from '../page/CustomLanguage';
import CustomTag from '../page/CustomTag';
import CustomLanguageSort from '../page/CustomLanguageSort';

const InitNavigator = createStackNavigator({
    Welcome: {
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        },
    },
});

const MainNavigator = createStackNavigator({
    Home: {
        screen: HomePage,
        navigationOptions: {
            header: null,
        },
    },
    Detail: {
        screen: DetailPage,
        navigationOptions: {
            header: null,
        },
    },
    WebPage: {
        screen: WebPage,
        navigationOptions: {
            header: null,
        },
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            header: null,
        },
    },
    CustomLanguage: {
        screen: CustomLanguage,
        navigationOptions: {
            header: null,
        },
    },
    CustomTag: {
        screen: CustomTag,
        navigationOptions: {
            header: null,
        },
    },
    CustomLanguageSort: {
        screen: CustomLanguageSort,
        navigationOptions: {
            header: null,
        },
    },
});

export default createAppContainer(
    createSwitchNavigator(
        {
            Init: InitNavigator,
            Main: MainNavigator,
        },
        {
            navigationOptions: {
                header: null,
            },
        },
    ),
);
