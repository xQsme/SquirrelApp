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
import sqrl from '../utils/images/sqrl.png';

const Dimensions = require('Dimensions');
const DEVICE_WIDTH = Dimensions.get('window').width;
let isIos = require('react-native').Platform.OS === 'ios';

export default class LoginScreen extends Component {

    static navigationOptions = {title: 'Welcome', header: null};

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            email: null,
            password: null,
            passwordConf: null,
            loading: false,
            isLoading: true,
            sqrl: false,
            register: false,
            login: false,
            google: null,
            fido: null,
            email_code: null,
            info: null,
            code_1: null,
            code_2: null,
            code_3: null,
            failed: false,
            red: false,
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

    handleRegister() {

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
            /*
            AsyncStorageManager.storeOnAssyncStorage(this.state.email,
                this.state.email,
                "1",
                "123");
            this.resetNavigation('EntriesScreen');*/

            LoginManagerApiFacade.register(this.state.username, this.state.email, this.state.password)
                .then((r) => {
                    if (r.status === 200) {
                        this.handleLogin();
                    } else {
                        Alert.alert(
                            'Error',
                            r._bodyText.split('["')[1].split('"]')[0].split('","').join('\n'),
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
                    "Register Failed.",
                    [
                        {text: 'Ok'},
                    ],
                    {cancelable: false}
                );
                this.setState({
                    loading: false,
                });
            });
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
            /*
            AsyncStorageManager.storeOnAssyncStorage(this.state.email,
                this.state.email,
                "1",
                "123");
            this.resetNavigation('EntriesScreen');*/

            LoginManagerApiFacade.login(this.state.email, this.state.password)
                .then((r) => {
                    if (r.status === 200) {
                        //Saves email, username, id and token of the logged user on storage to future use.
                        this.setState({
                            info: {name: JSON.parse(r._bodyText).name,
                                   email: JSON.parse(r._bodyText).email != null ? JSON.parse(r._bodyText).email : "",
                                   token: JSON.parse(r._bodyText).token,
                                   id: JSON.stringify(JSON.parse(r._bodyText).user_id)}
                        });
                        //get data with the token and insertDump
                        LoginManagerApiFacade.dump(JSON.parse(r._bodyText).token)
                            .then((responseJson) => {
                                DBInterface.insertDump(responseJson)
                                    .then((r => {
                                        if(responseJson.auth.google == '' && responseJson.auth.fido == '' && responseJson.auth.email == '')
                                        {
                                            AsyncStorageManager.storeOnAssyncStorage(this.state.info.email, this.state.info.name,
                                                this.state.info.id, this.state.info.token);
                                            this.resetNavigation('EntriesScreen');
                                        }
                                        else
                                        {
                                            this.setState({
                                                google: responseJson.auth.google,
                                                fido: responseJson.auth.fido,
                                                email_code: responseJson.auth.email,
                                                login: true
                                            })
                                        }
                                    })).catch((e) => {
                                    Alert.alert(
                                        'Error',
                                        "Error inserting information.",
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
            });
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

    handleActivityIndicator() 
    {
        if (this.state.loading) 
        {
            return (<ActivityIndicator size="large" color="#ffffff"/>);
        }
        if(this.state.register)
        {
            return(
                <View>
                    <View style={{height: 75}}> 
                        <TouchableOpacity style={LoginScreenStyles.button}
                            onPress={() => {
                                if (this.state.username != null && this.state.email != null && this.state.password != null && this.state.passwordConf != null) {
                                    if(this.state.password == this.state.passwordConf)
                                    {
                                        this.handleRegister();
                                    }
                                    else
                                    {
                                        Alert.alert(
                                            'Error',
                                            'Passwords must match.',
                                            [
                                                {text: 'Ok'},
                                            ],
                                            {cancelable: false}
                                        );
                                    }
                                }
                                else {
                                    Alert.alert(
                                        'Error',
                                        'Please fill all fields.',
                                        [
                                            {text: 'Ok'},
                                        ],
                                        {cancelable: false}
                                    );
                                }
                        }}>
                        <Text style={ButtonStyles.text}>
                            Register
                        </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 50}}>
                        <TouchableOpacity style={LoginScreenStyles.button}
                            onPress={() => this.setState({register: false})}>
                            <Text style={ButtonStyles.text}>
                            Login Instead
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>);
        }
        return(
            <View>
                <View style={{height: 75}}> 
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
                </View>
                <View style={{height: 50}}>
                    <TouchableOpacity style={LoginScreenStyles.button}
                        onPress={() => this.setState({register: true})}>
                        <Text style={ButtonStyles.text}>
                        Register Instead
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>);
    }

    render() {
        if(!this.state.login)
        {
            return (
                <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'rgb(212, 157, 65)'}} behavior={isIos ? 'padding' : null} >
                    <ScrollView contentContainerStyle={{
                        flexGrow: 1,
                        alignContent: 'center',
                        alignItems: 'center',
                        }}>
                        <View style={{paddingTop:30, paddingBottom: 30}}>
                            <TouchableOpacity
                                onPress={() => {this.setState({sqrl: !this.state.sqrl})}}>
                                <Image
                                    source={this.state.sqrl ? sqrl : logo}
                                    style={{width: 200, height: 200}}
                                />
                            </TouchableOpacity>
                        </View>
                        {this.renderLogin()}
                        {this.handleActivityIndicator()}
                    </ScrollView>
                </KeyboardAvoidingView>
            );
        }
        return(<KeyboardAvoidingView style={{flex: 1, backgroundColor: 'rgb(212, 157, 65)'}} behavior={isIos ? 'padding' : null} >
                    <ScrollView contentContainerStyle={{
                        flexGrow: 1,
                        alignContent: 'center',
                        alignItems: 'center',
                        }}>
                        {this.render2FA()}
                    </ScrollView>
                </KeyboardAvoidingView>);
    }

    render2FA()
    {
        if(this.state.google)
        {
            return(
            <View style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{height: 50}}>
                    <Icon
                        ios={'ios-lock'}
                        android={'md-lock'}
                        style={LoginScreenStyles.inlineImg}
                    />
                    <TextInput
                        style={LoginScreenStyles.input}
                        onChangeText={(text) => this.setState({code_1: text})}
                        placeholder="Google Authenticator Code"
                        placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                        autoCapitalize="none"
                        autoCorrect={true}
                        keyboardType="email-address"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={this.state.code_1}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </View>
                <View style={{height: 50}}>
                    <TouchableOpacity style={LoginScreenStyles.button}
                        onPress={() => {
                            LoginManagerApiFacade.google(this.state.info.token, this.state.code_1)
                                .then((r) => {
                                    if (r.status === 200) {
                                        this.setState({google: '',
                                            failed: false})
                                        if(this.state.fido == '' && this.state.email_code == '')
                                        { 
                                            AsyncStorageManager.storeOnAssyncStorage(this.state.info.email, this.state.info.name,
                                                this.state.info.id, this.state.info.token);
                                            this.resetNavigation('EntriesScreen');
                                        }
                                    }
                                    else
                                    {
                                        this.setState({failed:true,
                                            red: true});
                                        setTimeout(()=>{
                                            this.setState({red: false});
                                        }, 2000);
                                    }
                                });
                        }}>
                        <Text style={ButtonStyles.text}>
                        Authenticate
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: this.state.red ? 'red' : 'black', fontSize: 20}}>{this.state.failed ? 'Wrong code, try again' : ''}</Text>
            </View>);
        }
        if(this.state.fido)
        {
            return(
            <View style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{height: 50}}>
                    <Icon
                        ios={'ios-lock'}
                        android={'md-lock'}
                        style={LoginScreenStyles.inlineImg}
                    />
                    <TextInput
                        style={LoginScreenStyles.input}
                        onChangeText={(text) => this.setState({code_2: text})}
                        placeholder="FIDO Authenticator Code"
                        placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                        autoCapitalize="none"
                        autoCorrect={true}
                        keyboardType="email-address"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={this.state.code_2}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </View>
                <View style={{height: 50}}>
                    <TouchableOpacity style={LoginScreenStyles.button}
                        onPress={() => {
                            this.setState({fido: ''})
                            if(this.state.email_code == '')
                            {
                                AsyncStorageManager.storeOnAssyncStorage(this.state.info.email, this.state.info.name,
                                    this.state.info.id, this.state.info.token);
                                this.resetNavigation('EntriesScreen');
                            }
                        }}>
                        <Text style={ButtonStyles.text}>
                        Authenticate
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: this.state.red ? 'red' : 'black', fontSize: 20}}>{this.state.failed ? 'Wrong code, try again' : ''}</Text>
            </View>);
        }
        if(this.state.email_code)
        {
            return(
            <View style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{height: 50}}>
                    <TouchableOpacity style={LoginScreenStyles.button}
                        onPress={() => {
                            LoginManagerApiFacade.email(this.state.info.token)
                            .then((r) => {
                                if (r.status !== 200) 
                                {
                                    Alert.alert(
                                        'Error',
                                        'Failed sending e-mail, please try again later.',
                                        [
                                            {text: 'Ok'},
                                        ],
                                        {cancelable: false}
                                    );
                                }
                                else
                                {
                                    Alert.alert(
                                        'E-mail sent',
                                        'Please wait a few seconds.',
                                        [
                                            {text: 'Ok'},
                                        ],
                                        {cancelable: false}
                                    );
                                }
                            });
                        }}>
                        <Text style={ButtonStyles.text}>
                        Send E-mail
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 50}}>
                    <Icon
                        ios={'ios-lock'}
                        android={'md-lock'}
                        style={LoginScreenStyles.inlineImg}
                    />
                    <TextInput
                        style={LoginScreenStyles.input}
                        onChangeText={(text) => this.setState({code_3: text})}
                        placeholder="Code sent to E-mail"
                        placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                        autoCapitalize="none"
                        autoCorrect={true}
                        keyboardType="email-address"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={this.state.code_3}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </View>
                <View style={{height: 50}}>
                    <TouchableOpacity style={LoginScreenStyles.button}
                        onPress={() => {
                            LoginManagerApiFacade.validateEmail(this.state.info.token, this.state.code_3)
                                .then((r) => {
                                    if (r.status === 200) {  
                                        AsyncStorageManager.storeOnAssyncStorage(this.state.info.email, this.state.info.name,
                                            this.state.info.id, this.state.info.token);
                                        this.resetNavigation('EntriesScreen');
                                    }
                                    else
                                    {
                                        this.setState({failed:true,
                                                       red: true});
                                        setTimeout(()=>{
                                            this.setState({red: false});
                                        }, 2000);
                                    }
                                });
                        }}>
                        <Text style={ButtonStyles.text}>
                        Authenticate
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: this.state.red ? 'red' : 'black', fontSize: 20}}>{this.state.failed ? 'Wrong code, try again' : ''}</Text>
            </View>);
        }
    }

    renderLogin(){
        if(this.state.register)
        {
            return(
                <View>
                    <View style={{height: 50}}>
                        <Icon
                            ios={'ios-person'}
                            android={'md-person'}
                            style={LoginScreenStyles.inlineImg}
                        />
                        <TextInput
                            style={LoginScreenStyles.input}
                            onChangeText={(text) => this.setState({username: text})}
                            placeholder="Username"
                            placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                            autoCapitalize="none"
                            autoCorrect={true}
                            keyboardType="email-address"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={(event) => { 
                                this.refs.email.focus(); 
                              }}
                            enablesReturnKeyAutomatically={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.username}
                            keyboardShouldPersistTaps={'handled'}
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
                            ref='email'
                            onChangeText={(text) => this.setState({email: text})}
                            placeholder="E-Mail"
                            placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                            autoCapitalize="none"
                            autoCorrect={true}
                            keyboardType="email-address"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={(event) => { 
                                this.refs.password.focus(); 
                              }}
                            enablesReturnKeyAutomatically={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.email}
                            keyboardShouldPersistTaps={'handled'}
                        />
                    </View>
                    <View style={{height: 50}}>
                        <Icon
                            ios={'ios-lock'}
                            android={'md-lock'}
                            style={LoginScreenStyles.inlineImg}
                        />
                        <TextInput
                            style={LoginScreenStyles.input}
                            ref='password'
                            onChangeText={(text) => this.setState({password: text})}
                            placeholder="Password"
                            placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={(event) => { 
                                this.refs.passwordconf.focus(); 
                              }}
                            blurOnSubmit={true}
                            secureTextEntry={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.password}
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
                            ref='passwordconf'
                            onChangeText={(text) => this.setState({passwordConf: text})}
                            placeholder="Password Confirmation"
                            placeholderTextColor={'rgba(100, 100, 100, 0.60)'}
                            keyboardType="default"
                            returnKeyType="done"
                            blurOnSubmit={true}
                            secureTextEntry={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.passwordConf}
                        />
                    </View>
                </View>);
        }
        return(
            <View>
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
                        onSubmitEditing={(event) => { 
                            this.refs.pass.focus(); 
                          }}
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
                        ref='pass'
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
            </View>);
    }
}
