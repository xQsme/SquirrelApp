import React, {Component} from 'react';
import {View} from "react-native";
import {Body, Left, Right} from "native-base";

/**
 * Item to be used as a List item content
 *
 * @prop leftContent = content to be on the left side with a flex dimension of 1
 * @prop centerContent = content to be at the center with a flex dimension of 8
 * @prop rightContent = content to be on the right side with a flex dimension of 1
 *
 */
export default class RowItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={{
                alignItems: 'baseline',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

                <Body >
                    {this.props.centerContent}
                    {this.props.centerContentDown}
                </Body>

                <Body style={{alignItems: 'flex-end',
                            textAlign: 'right'}}>
                    {this.props.rightContent}
                </Body>
            </View>
        );
    }
}
