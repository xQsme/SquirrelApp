import React, {Component} from 'react';
import {Icon} from "native-base";
import {
    ActivityIndicator, Alert,
    Image, KeyboardAvoidingView, NetInfo, ScrollView, Text, TextInput, TouchableOpacity,
    View
} from "react-native";
import {ButtonStyles, LoginScreenStyles} from "../utils/styles/Styles";
import {NavigationActions} from "react-navigation";
import {LoginManagerApiFacade} from "../utils/facades/LoginManagerApiFacade";
import {DBInterface} from "../utils/db/DBInterface";
import {AsyncStorageManager} from "../utils/AsyncStorageManager";
import logo from '../utils/images/logo.png';

const Dimensions = require('Dimensions');
const DEVICE_WIDTH = Dimensions.get('window').width;
let isIos = require('react-native').Platform.OS === 'ios';

export default class LoginScreen extends Component {

    static navigationOptions = {title: 'Welcome', header: null};

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            loading: false,
            isLoading: true
        };

        AsyncStorageManager.getUserToken()
            .then((t) => {
                if (t !== null) {
                    this.setState({
                        isLoading: false
                    });
                    //already logged in then goes to the surveysScreen and clears navigation, so that user cant go back to login screen
                    this.resetNavigation('EntriesScreen')
                } else (
                    this.setState({
                        isLoading: false
                    })
                )
            }).catch((e) => {
        });
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                this.state.status = isConnected
            }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {
        this.state.status = isConnected;
    };


    handleLogin() {

        //if network connected
        if (this.state.status) {
            this.setState({
                loading: true,
            });

            //Open db Connection
            DBInterface.openDBConnection();

            //Drop Tables ---- ONLY USED IF NEEDED TO UPDATE db
            //DBInterface.dropTables();

            //Create Tables
            DBInterface.createTables();

            AsyncStorageManager.storeOnAssyncStorage(this.state.email,
                this.state.email,
                "1",
                "123");
            this.resetNavigation('EntriesScreen');

            /*Care4Value2CareApiFacade.login(this.state.email, this.state.password)
                .then((r) => {
                    if (r.status === 200) {
                        //Saves email, username, id and token of the logged user on storage to future use.
                        AsyncStorageManager.storeOnAssyncStorage(JSON.parse(r._bodyText).email != null ? JSON.parse(r._bodyText).email : "",
                            JSON.parse(r._bodyText).username,
                            JSON.stringify(JSON.parse(r._bodyText).user_id),
                            JSON.parse(r._bodyText).token);

                        let change = JSON.parse(r._bodyText).password_changed;

                        //get data with the token and insertDump
                        Care4Value2CareApiFacade.dump(JSON.parse(r._bodyText).token)
                            .then((responseJson) => {
                                DBInterface.insertDump(responseJson)
                                    .then((r => {
                                        //navigate to surveys screen and delete navigation props, so that back option isn't available
                                        if(!change)
                                        {
                                            this.resetNavigation('ChangePasswordScreen');
                                        }
                                        else
                                        {
                                            this.resetNavigation('SurveysScreen');
                                        }
                                    })).catch((e) => {
                                    Alert.alert(
                                        'Error',
                                        "Error inserting informaçation.",
                                        [
                                            {text: 'Ok'},
                                        ],
                                        {cancelable: false}
                                    );
                                    this.setState({
                                        loading: false,
                                    });
                                    AsyncStorageManager.clearUserData()
                                });
                            })
                            .catch(e => {
                                Alert.alert(
                                    'Error',
                                    "Error obtaining data from server.",
                                    [
                                        {text: 'Ok'},
                                    ],
                                    {cancelable: false}
                                );
                                this.setState({
                                    loading: false,
                                });
                                AsyncStorageManager.clearUserData()
                            });
                    } else {
                        Alert.alert(
                            'Error',
                            "Login Failed.",
                            [
                                {text: 'Ok'},
                            ],
                            {cancelable: false}
                        );
                        this.setState({
                            loading: false,
                        });
                    }

                }).catch((error) => {
                Alert.alert(
                    'Error',
                    "Login Failed.",
                    [
                        {text: 'Ok'},
                    ],
                    {cancelable: false}
                );
                this.setState({
                    loading: false,
                });
            });*/
        }
        //if network not connected
        else {
            Alert.alert(
                'Error',
                'No intenet connection.',
                [
                    {text: 'Ok'},
                ],
                {cancelable: false}
            );
            this.setState({
                loading: false,
            });
        }
    }

    resetNavigation(targetRoute) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: targetRoute}),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    _next = () => {
        this._passwordInput && this._passwordInput.focus();
    };

    handleActivityIndicator() {
        if (this.state.loading) {
            return (<ActivityIndicator size="large" color="#ffffff"/>);
        }

        return (<View style={{height: 50}}>
            <TouchableOpacity style={LoginScreenStyles.button}
                              onPress={() => {
                                  if (this.state.email != null && this.state.password != null) {
                                        this.handleLogin();
                                  }
                                  else {
                                      Alert.alert(
                                          'Error',
                                          'Please fill both fields.',
                                          [
                                              {text: 'Ok'},
                                          ],
                                          {cancelable: false}
                                      );
                                  }

                              }}>
                <Text style={ButtonStyles.text}>
                    Login
                </Text>
            </TouchableOpacity>
        </View>);
    }

    render() {

        return (
            <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'rgb(212, 157, 65)'}} behavior={isIos ? 'padding' : null} >


                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: DEVICE_WIDTH / 10,
                    alignContent: 'center',
                    alignItems: 'center',
                    }}>

                <View style={{paddingTop:30, paddingBottom: 30}}>
                <Image
                    source={logo}
                    style={{width: 200, height: 200}}
                />
                </View>

                <View style={{height: 50}}>
                    <Icon
                        ios={'ios-person'}
                        android={'md-person'}
                        style={LoginScreenStyles.inlineImg}
                    />
                    <TextInput
                        style={LoginScreenStyles.input}
                        onChangeText={(text) => this.setState({email: text})}
                        placeholder="Username or E-Mail"
                        placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                        autoCapitalize="none"
                        autoCorrect={true}
                        keyboardType="email-address"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={this._next}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={this.state.email}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </View>

                <View style={{height: 80}}>
                    <Icon
                        ios={'ios-lock'}
                        android={'md-lock'}
                        style={LoginScreenStyles.inlineImg}
                    />
                    <TextInput
                        style={LoginScreenStyles.input}
                        ref={ref => {
                            this._passwordInput = ref
                        }}
                        onChangeText={(text) => this.setState({password: text})}
                        placeholder="Password"
                        placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                        keyboardType="default"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        secureTextEntry={true}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={this.state.password}
                    />
                </View>
                {
                    this.handleActivityIndicator()
                }
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
