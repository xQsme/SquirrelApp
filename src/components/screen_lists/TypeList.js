import React, {Component} from 'react';
import {Icon, ListItem, Text, View} from "native-base";
import {Image, FlatList, RefreshControl} from "react-native";
import RowItem from "../row_item/RowItem";
import {NetInfo} from 'react-native';
import active from '../../utils/images/active.png';
import inactive from '../../utils/images/inactive.png';
/**
 *
 * @prop navigation {navigation object}
 * @prop surveys {array}
 */
let isIos = require('react-native').Platform.OS === 'ios';

export default class TypeList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            types: props.types
        };
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

    renderRow(item) {
                
        return (
            <RowItem
                centerContent={
                    <View>
                        <Text>
                            {item.title}
                        </Text>
                    </View>
                }
            />
        );
    }

    saveAnswer(item) {
        this.props.onSelectAnswer(item);  
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.props.types}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        <ListItem style={{marginLeft: 0, paddingLeft: 15}}
                            onPress={() => {
                                this.saveAnswer(item)
                            }}>
                            {this.renderRow(item)}

                        </ListItem>
                    }
                />
            </View>
        );
    }
}