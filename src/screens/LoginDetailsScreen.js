import React, {Component} from 'react';
import BaseScreen from "./BaseScreen";
import {Icon, Text, View} from "native-base";
import {Alert, TouchableOpacity} from "react-native";
import {LoginDetailsScreenStyles} from "../utils/styles/Styles";
import {LoginManagerApiFacade} from "../utils/facades/LoginManagerApiFacade";
import {DBInterface} from "../utils/db/DBInterface";
import {AsyncStorageManager} from "../utils/AsyncStorageManager";


const Dimensions = require('Dimensions');
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class LoginDetailsScreen extends Component {

    static navigationOptions = {
        title: 'User Settings',
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            email: null,
            username: null
        };

        AsyncStorageManager.getUserEmail()
            .then((e) => {
                this.setState({
                    email: e
                });
                AsyncStorageManager.getUserUsername()
                    .then((u) => {
                        this.setState({
                            username: u,
                            loading: false
                        });

                    }).catch((e) => {
                });
            }).catch((e) => {
        });
    }

    renderEmail()
    {
        if(this.state.email != null)
        {
            return(
                <View style={{height: 60, flexDirection: 'row'}}>
                    <Icon
                        //ios={'ios-at-outline'}
                        //android={'md-at'}
                        ios={'ios-mail'}
                        android={'md-mail'}
                        style={LoginDetailsScreenStyles.inlineImg}
                    />
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 17}}>
                        {' ' + "E-mail:"}
                    </Text>
                    <Text style={{textAlign: 'center'}}>
                        {' ' + this.state.email}
                    </Text>
                </View>);
        }
    }

    render() {

        return (
            <BaseScreen
                content={
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'column',
                        alignContent: 'center',
                        flex: 1,
                        paddingTop: DEVICE_WIDTH / 4
                    }}>
                        <View style={{height: 60, flexDirection: 'row'}}>
                            <Icon
                                ios={'ios-person'}
                                android={'md-person'}
                                style={LoginDetailsScreenStyles.inlineImg}
                            />
                            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 17}}>
                                {' ' + "Username:"}
                            </Text>
                            <Text style={{textAlign: 'center'}}>
                                {' ' + this.state.username}
                            </Text>
                        </View>
                        {this.renderEmail()}
                        <View style={{height: 60, paddingTop: 20}}>
                            <TouchableOpacity style={LoginDetailsScreenStyles.buttonDelete}
                                              onPress={() => {
                                                AsyncStorageManager.clearUserData()
                                                .then((r) => {
                                                    DBInterface.dropTables()
                                                    this.props.navigation.navigate("LoginScreen");
                                                });
                                              }}>
                                <Text style={LoginDetailsScreenStyles.buttonText}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                }
            />
        );
    }
}

/*
                                                AsyncStorageManager.getUserToken()
                                                    .then((token) => {
                                                        LoginManagerApiFacade.logout(token)
                                                            .then((response) => {
                                                                AsyncStorageManager.clearUserData()
                                                                    .then((r) => {
                                                                        DBInterface.dropTables()
                                                                        this.props.navigation.navigate("LoginScreen");
                                                                    })
                                                            }).catch((e) => {
                                                            Alert.alert(
                                                                'Error',
                                                                'Error logging out',
                                                                [
                                                                    {text: 'Ok'},
                                                                ],
                                                                {cancelable: false}
                                                            );
                                                        });
                                                    });*/