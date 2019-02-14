import React, {Component} from 'react';
import {HeaderBackButton} from "react-navigation";
import {NetInfo, Text, TouchableOpacity, Image} from 'react-native';
import BaseScreen from "./BaseScreen";
import {DBQueryHelper} from "../utils/db/DBQueryHelper";

export default class DetailsScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.key.title,
            headerLeft: <HeaderBackButton
                onPress={() => navigation.goBack()}
            />,
        };
    };

    componentDidMount() {
        /*NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                this.state.status = isConnected
            }
        );*/
    }

    componentWillUnmount() {
        //NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
        this.props.navigation.state.params.onNavigateBack();
    }

    constructor(props) {
        super(props);
        this.state = {
            key: this.props.navigation.state.params.key
        };

    }



    /*handleConnectionChange = (isConnected) => {
        this.state.status = isConnected;
    };*/

    render() {
        return (
            <BaseScreen
                content={
                    <Text>Empty For Now</Text>
                }
            />
        );
    }

}