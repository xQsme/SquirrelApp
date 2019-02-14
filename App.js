import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import EntriesScreen from "./src/screens/EntriesScreen";
import KeysScreen from "./src/screens/KeysScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import LoginDetailsScreen from "./src/screens/LoginDetailsScreen";
import {AsyncStorageManager} from "./src/utils/AsyncStorageManager";

/**
 * Define app routes
 */

let isLogin;
AsyncStorageManager.getUserToken()
    .then((t) => {
        isLogin = true;
    })
    .catch((e) => {
        isLogin = false;
    });


const RootStack = StackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen
        },
        EntriesScreen: {
            screen: EntriesScreen
        },
        KeysScreen: {
            screen: KeysScreen
        },
        DetailsScreen: {
            screen: DetailsScreen
        },
        LoginDetailsScreen: {
            screen: LoginDetailsScreen
        }
    },
    {
        initialRouteName: isLogin ? 'EntriesScreen' : 'LoginScreen'
    },
    {
        headerMode: 'screen'
    }
);


export default class App extends React.Component {

    render() {
        return <RootStack/>;
    }
}
