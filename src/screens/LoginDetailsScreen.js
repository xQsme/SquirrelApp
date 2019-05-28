import React, {Component} from 'react';
import BaseScreen from "./BaseScreen";
import {Icon, Text, View} from "native-base";
import {Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, TextInput} from "react-native";
import {LoginScreenStyles, LoginDetailsScreenStyles} from "../utils/styles/Styles";
import {LoginManagerApiFacade} from "../utils/facades/LoginManagerApiFacade";
import {DBInterface} from "../utils/db/DBInterface";
import {AsyncStorageManager} from "../utils/AsyncStorageManager";
let isIos = require('react-native').Platform.OS === 'ios';

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
            username: null,
            pin: false,
            code: null
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
        if(this.state.pin)
        {
            return(
            <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}} behavior={isIos ? 'padding' : null} >
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignContent: 'center',
                    alignItems: 'center',
                    }}>
                    <View style={{flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextInput
                            style={LoginScreenStyles.inputDark}
                            onChangeText={(text) => this.setState({code: text})}
                            placeholder="Pin Code"
                            placeholderTextColor={'rgba(255, 255, 255, 0.60)'}
                            autoCapitalize="none"
                            keyboardType="default"
                            returnKeyType="done"
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.code}
                        />
                        <View style={{height: 60, paddingTop: 20}}>
                            <TouchableOpacity style={LoginDetailsScreenStyles.buttonSelect}
                                onPress={() => {
                                    if(this.state.code == null || this.state.code.length < 4 || this.state.code.length > 6)
                                    {
                                        Alert.alert(
                                            'Error',
                                            "Pin must be between 4 and 6 digits long.",
                                            [
                                                {text: 'Ok'},
                                            ],
                                            {cancelable: false}
                                        );
                                    }
                                    else
                                    {
                                        this.setState({pin: false});
                                        AsyncStorageManager.setUserPin(this.state.code);
                                        Alert.alert(
                                            'Success',
                                            "New pin set.",
                                            [
                                                {text: 'Ok'},
                                            ],
                                            {cancelable: false}
                                        );
                                    }
                                }}>
                                <Text style={LoginDetailsScreenStyles.buttonText}>
                                    Change Pin
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 60, paddingTop: 20}}>
                            <TouchableOpacity style={LoginDetailsScreenStyles.buttonDelete}
                                    onPress={() => {
                                    this.setState({pin: false})
                                    }}>
                                <Text style={LoginDetailsScreenStyles.buttonText}>
                                    Dismiss
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>);
        }

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
                            <TouchableOpacity style={LoginDetailsScreenStyles.buttonSelect}
                                              onPress={() => {
                                                    this.setState({pin: true});
                                              }}>
                                <Text style={LoginDetailsScreenStyles.buttonText}>
                                    Change Pin
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 60, paddingTop: 20}}>
                            <TouchableOpacity style={LoginDetailsScreenStyles.buttonDelete}
                                              onPress={() => {
                                                AsyncStorageManager.getUserToken()
                                                .then((token) => {
                                                    LoginManagerApiFacade.logout(token)
                                                        .then((response) => {
                                                            AsyncStorageManager.clearUserData()
                                                                .then((r) => {
                                                                    AsyncStorageManager.getUserPin()
                                                                    .then((t) => {
                                                                        if (t == null) 
                                                                        {
                                                                            Alert.alert(
                                                                                'Error',
                                                                                "Pin not set.",
                                                                                [
                                                                                    {text: 'Ok'},
                                                                                ],
                                                                                {cancelable: false}
                                                                            );
                                                                        } 
                                                                        else 
                                                                        {
                                                                            AsyncStorageManager.setUserPin(t);
                                                                            DBInterface.dropTables()
                                                                            this.props.navigation.navigate("LoginScreen");
                                                                        }
                                                                    }).catch((e) => {
                                                                    });
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