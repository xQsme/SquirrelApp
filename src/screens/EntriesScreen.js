import React, {Component} from 'react';
import {Icon} from 'native-base';
import EntryList from "../components/screen_lists/EntryList";
import {DBInterface} from "../utils/db/DBInterface";
import {DBQueryHelper} from "../utils/db/DBQueryHelper";
import BaseScreen from "./BaseScreen";
import {TouchableOpacity, Image} from "react-native";

let isIos = require('react-native').Platform.OS === 'ios';

export default class EntriesScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Squirrel',
            headerLeft: <Image
                source={require('../utils/images/icon.png')}
                style={{width: 35, height: 35, marginLeft: 15}}>
            </Image>,
            headerRight: (
                <TouchableOpacity
                    style={{paddingRight: 20}}
                    onPress={() => {
                        navigation.navigate('LoginDetailsScreen', {})
                    }}>
                    <Icon
                        ios={'ios-person'}
                        android={'md-person'}
                        style={{color: 'rgba(0,120,255,1)'}}
                    />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            logins: []
        };
        DBInterface.openDBConnection();
        this.queryLogins();
    }

    queryLogins() {
        DBQueryHelper.loginQuery()
            .then(l => {
                this.setState({
                    logins: l
                });
            });
    }

    render() {
        return (
            <BaseScreen
                content={
                    <EntryList
                        navigation={
                            this.props.navigation
                        }
                        logins={this.state.logins}
                    />
                }
            />
        );
    }
}
