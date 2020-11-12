import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppNavigators from './Navigator/AppNavigators';
import store from './store/index';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppNavigators />
            </Provider>
        );
    }
}