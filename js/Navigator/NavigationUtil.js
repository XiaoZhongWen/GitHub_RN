
export default class NavigationUtil {

    static goPage(params, page) {
        const navigation = NavigationUtil.navigation;
        navigation.navigate(page, {...params});
    }

    static resetToHomePage(params) {
        const { navigation } = params
        navigation.navigate("Home");
    }
}