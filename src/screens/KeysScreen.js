import React, {Component} from 'react';
import {HeaderBackButton} from "react-navigation";
import {NetInfo, Text, TouchableOpacity, Image} from 'react-native';
import BaseScreen from "./BaseScreen";
import BaseScreenFooter from "./BaseScreenFooter";
import {DBQueryHelper} from "../utils/db/DBQueryHelper";
import KeyList from "../components/screen_lists/KeyList";
import TypeList from "../components/screen_lists/TypeList";
import {ButtonStyles, LoginScreenStyles} from "../utils/styles/Styles";
import add from '../utils/images/add.png';

export default class KeysScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.login.title,
            headerLeft: <HeaderBackButton
                onPress={() => navigation.goBack()}
            />,
            headerRight: (
                <TouchableOpacity
                    style={{paddingRight: 20}}
                    onPress={() => navigation.state.params.handleSelect()}>
                    <Image
                        source={add}
                        style={{width: 35, height: 35}}
                    />
                </TouchableOpacity>
            ),
        };
    };

    componentDidMount() {
        this.props.navigation.setParams({ handleSelect: this.selectType });
        /*NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                this.state.status = isConnected
            }
        );*/
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
        this.props.navigation.state.params.onNavigateBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            login: this.props.navigation.state.params.login,
            keys: [],
            types: [],
            picking: false
        };

        this.getKeys();
    }

    selectType = () =>
    {
        this.setState({
            picking: !this.state.picking
        })
    }

    getKeys()
    {
        DBQueryHelper.keyQuery(this.state.login.id)
        .then(k => {
            DBQueryHelper.typeQuery()
            .then(t => {
                this.setState({
                    keys: k,
                    types: t,
                    picking: false
                });
            });
        });
    }

    /*handleConnectionChange = (isConnected) => {
        this.state.status = isConnected;
    };*/

    render() {
        if(this.state.picking)
        {
            return (
                <BaseScreen
                    content={
                        <TypeList
                            onSelectAnswer={this.handlePick}
                            navigation={
                                this.props.navigation
                            }
                            types={this.state.types}
                        />
                    }
                />
            );
        }
        if(this.state.login.active)
        {
            return (
                <BaseScreenFooter
                    content={
                        <KeyList
                            onNavigateBack={() => {
                                this.getKeys();
                            }}
                            navigation={
                                this.props.navigation
                            }
                            keys={this.state.keys}
                        />
                    }
                    footer={
                        <TouchableOpacity style={ButtonStyles.buttonDisconnect}
                            onPress={() => {
                                this.handlePress();
                            }}>
                            <Text style={ButtonStyles.textConnect}>
                                Disconnect
                            </Text>
                        </TouchableOpacity>
                    }
                />
            );
        }
        return (
            <BaseScreen
                content={
                    <KeyList
                        onNavigateBack={() => {
                            this.getKeys();
                        }}
                        navigation={
                            this.props.navigation
                        }
                        keys={this.state.keys}
                    />
                }
            />
        );
    }

    handlePress()
    {
        DBQueryHelper.updateLogin(this.state.login.id,  0).then(r =>{
            let updatedLogin=this.state.login;
            updatedLogin.active = 0;
            this.setState({
                login: updatedLogin
            })
        });
    }

    handlePick = (p) => {
        DBQueryHelper.insertKey(this.state.login.id, p.id).then(r =>{
            this.getKeys();
        });
    }

}