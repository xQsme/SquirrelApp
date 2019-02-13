import React, {Component} from 'react';
import {HeaderBackButton} from "react-navigation";
import {NetInfo, Text, TouchableOpacity, Image} from 'react-native';
import BaseScreen from "./BaseScreen";
import {DBQueryHelper} from "../utils/db/DBQueryHelper";
import KeyList from "../components/screen_lists/KeyList";
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
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                this.state.status = isConnected
            }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
        this.props.navigation.state.params.onNavigateBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            login_id: this.props.navigation.state.params.login.id,
            keys: [],
            types: []
        };

        this.getKeys();
    }

    selectType = () =>
    {
        console.log(this.state.types);
    }

    getKeys()
    {
        DBQueryHelper.keyQuery(this.state.login_id)
        .then(k => {
            DBQueryHelper.typeQuery()
            .then(t => {
                this.setState({
                    keys: k,
                    types: t
                });
            });
        });
    }

    handleConnectionChange = (isConnected) => {
        this.state.status = isConnected;
    };

    render() {

        return (
            <BaseScreen
                content={
                    <KeyList
                        navigation={
                            this.props.navigation
                        }
                        keys={this.state.keys}
                    />
                }
            />
        );
    }

}