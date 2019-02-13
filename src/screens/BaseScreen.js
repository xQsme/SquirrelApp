import React, {Component} from 'react';
import {
    Container, Content
} from 'native-base';


export default class BaseScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Container>

                <Content style={{backgroundColor : 'white'}}>
                    {this.props.content}
                </Content>

            </Container>
        );
    }
}
