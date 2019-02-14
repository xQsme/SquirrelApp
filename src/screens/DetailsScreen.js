import React, {Component} from 'react';
import {HeaderBackButton} from "react-navigation";
import {View, NetInfo, Text, TouchableOpacity, Image} from 'react-native';
import BaseScreenFooter from "./BaseScreenFooter";
import {DBQueryHelper} from "../utils/db/DBQueryHelper";
import {ButtonStyles} from "../utils/styles/Styles";

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
            <BaseScreenFooter
                content={
                    <View></View>
                }
                footer={
                    <TouchableOpacity style={this.state.key.active ? ButtonStyles.buttonDisconnect : ButtonStyles.buttonConnect}
                        onPress={() => {
                            this.handlePress();
                        }}>
                        <Text style={ButtonStyles.textConnect}>
                            {this.state.key.active ? "Deactivate" : "Activate"}
                        </Text>
                    </TouchableOpacity>
                }
            />
        );
    }

    handlePress()
    {
        DBQueryHelper.updateKey(this.state.key.id,  this.state.key.active ? 0 : 1).then(r =>{
            let updatedKey=this.state.key;
            updatedKey.active = !updatedKey.active;
            this.setState({
                key: updatedKey
            })
        });
    }

}