import React, {Component} from 'react';
import {ListItem, Text, View} from "native-base";
import {FlatList} from "react-native";
import RowItem from "../row_item/RowItem";

export default class EntryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logins: props.logins
        };
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
                        <Text style={{textAlign: 'right'}}>
                            {item.date}
                        </Text>
                        <Text style={{textAlign: 'right'}}>
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