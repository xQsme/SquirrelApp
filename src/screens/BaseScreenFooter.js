import React, {Component} from 'react';
import {
    Footer, View
} from 'native-base';
import {KeyboardAvoidingView} from "react-native";

let isIos = require('react-native').Platform.OS === 'ios';
export default class BaseScreenFooter extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (

            <KeyboardAvoidingView style={{flex: 1}} behavior={isIos ? 'padding' : null} keyboardVerticalOffset={60}>
                <View style={{backgroundColor: 'white', flex: 1}}>
                    {this.props.content}
                </View>


                <Footer style={{backgroundColor: require('react-native').Platform.OS === 'ios' ? null : "rgb(255,255,255)", elevation: 10}}>
                    {this.props.footer}
                </Footer>
            </KeyboardAvoidingView>
        );
    }
}
