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

export default class EntryList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            logins: props.logins
        };
    }

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
    }

    /*handleConnectionChange = (isConnected) => {
        this.state.status = isConnected;
    };*/

    renderIcon(item)
    {
        if(item.active)
        {
            return(
                <Image
                    source={active}
                    style={{width: 30, height: 30}}
                />);
        }
        return(
            <Image
                source={inactive}
                style={{width: 30, height: 30}}
            />);
    }

    renderRow(item) {
                
        return (
            <RowItem
                centerContent={
                    <View>
                        <Text>
                            {item.source}
                        </Text>
                        <Text>
                            {item.ip}
                        </Text>
                    </View>
                }
                rightContent={
                    <View>
                        <Text>
                            {item.date}
                        </Text>
                        <Text>
                            {item.time}
                        </Text>
                    </View>
                }
            />
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.props.onNavigateBack()
                            }}
                        />
                    }
                    data={this.props.logins}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        <ListItem
                            style={{marginLeft: 0, paddingLeft: 15}}>
                            {this.renderRow(item)}
                        </ListItem>
                    }
                />
            </View>
        );
    }
}