import React, {Component} from 'react';
import {Badge, Button, Icon, Text} from 'native-base';
import EntryList from "../components/screen_lists/EntryList";
import {DBInterface} from "../utils/db/DBInterface";
import {DBQueryHelper} from "../utils/db/DBQueryHelper";
import BaseScreen from "./BaseScreen";
import {TouchableOpacity} from "react-native";


let isIos = require('react-native').Platform.OS === 'ios';

export default class EntriesScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Login Manager',
            headerLeft: null,
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
                    logins: l,
                });
            });
    }

    /**
     *
     * @param state - will show surveys with this state
     * @param btnText {string} - btn text
     * @param iconType {string} - icon font
     * @param iconName {string} - name of the incon to use
     * @param badgeText {string nullable} - text to put in the badge
     * @returns {XML}
     */
    renderButton(state, btnText, iconType, iconName, badgeText = 0) {

        let hasBadge = badgeText !== 0;

        //define the color blue if the state is selected.
        let style = isIos ? null : {color: isIos ? null : this.state.surveysStateToShow === state ? "rgb(255,255,255)" : "rgba(0,120,255,0.7)"}
        let styleButtonSelected = isIos ? null : this.state.surveysStateToShow === state ? 'rgba(0,120,255,0.9)' : 'rgb(255,255,255)'
        return (
            <Button
                horizontal
                badge={hasBadge}
                onPress={() => {
                    {
                        this.state.surveysStateToShow = state
                    }
                    this.syncData();

                }}
                active={isIos ? this.state.surveysStateToShow === state : null}
                backgroundColor={styleButtonSelected}
            >
                {hasBadge ? <Badge><Text>{badgeText}</Text></Badge> : null}
                <Icon type={iconType} name={iconName} style={style}/>
                <Text style={style}>{btnText}</Text>
            </Button>);
    }


    componentDidMount() {
        this.syncData();
        //AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        //AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.syncData();
        }
        this.setState({appState: nextAppState});
    }


    syncData(){
        this.queryLogins();
        /*DBQueryHelper.getLastTimestamp()
            .then((timestamp) => {
            AsyncStorageManager.getUserToken()
                .then((token) => {
                Care4Value2CareApiFacade.dumpAfter(timestamp, token)
                    .then((responseJson) => {
                        DBInterface.insertDump(responseJson)
                            .then(() => {
                                this.queryResults();
                                this.queryResultsMandatory();
                                this.queryAvailableSurveys();
                                this.querySurveysInProgress();
                                this.querySurveysCompleted();
                                this.querySurveysCompletedSynced();
                            })
                    }).catch((e)=>{
                        //could not request bcause is offline but still needs to query the surveys to show.
                        this.queryResults();
                        this.queryResultsMandatory();
                        this.querySurveysInProgress();
                        this.querySurveysCompleted();
                        this.querySurveysCompletedSynced();
                })
            })
        })*/
    }


    render() {

        return (
            <BaseScreen
                content={
                    <EntryList
                        onNavigateBack={() => {
                            this.syncData();
                        }}
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
