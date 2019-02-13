import React, {Component} from 'react';
import {StyleSheet} from 'react-native';


const Dimensions = require('Dimensions');
const DEVICE_WIDTH = Dimensions.get('window').width;

/**
 * General styles - they are not used directly
 * Can not be a StyleSheet
 *
 */
export const GeneralStyles = {
    radio_and_check: {
        fontSize: 25,
        color: 'black'
    },
    title_h2: {
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 5,
        color: 'black'
    },
    title_h3: {
        textAlign: 'center',
        paddingBottom: 15,
        fontSize: 17,
    },
    questionScreenSurveyTitle: {
        alignItems: 'center',
        paddingBottom: 15,
        paddingTop: 15,
    },

};

export const QuestionScreenStyles = StyleSheet.create({
    question: GeneralStyles.title_h2,

    description: {
        paddingTop: 10,
        paddingBottom: 10,
        fontSize : 14,
        textAlign: 'center',
        color: 'rgba(100,100,100, 0.8)'
    },
    button: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor : 'transparent'
    }
});

export const QuestionsListStyles = StyleSheet.create({
    survey_question_blocked_answered: {
        color: 'rgb(0,122,255)'
    },
    survey_question_blocked_not_answered: {
        color: 'grey'
    },
    survey_question_answered: {
        color: 'green'
    },
    survey_question_not_answered: {
        color: 'black'
    },
    surveyTitleStyle: {
        textAlign: 'center', flex: 1
    },
    listHeaderComponentStyle: {
        textAlign: 'center', color: 'green', fontWeight: 'bold', fontSize: 16
    },
});

export const ButtonStyles = StyleSheet.create({
    text: {color: 'rgb(0,0,0)'},
    textAndroid: {color: 'rgb(0,122,255)'},
    textRed: {color: 'rgb(255,51,51)'},
    textAndroidRed: {color: 'rgb(255,51,51)'},
    button: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor : 'transparent',
    }
});

export const SurveysListStyles = StyleSheet.create({
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 17,
        fontWeight: 'bold',
        backgroundColor: 'rgba(227,227,227,1)',
    }
});

export const LoginScreenStyles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: DEVICE_WIDTH - 40,
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 45,
        borderRadius: 20,
        fontSize: 16,
        color: '#000000',
    },
    inlineImg: {
        position: 'absolute',
        zIndex: 99,
        width: 25,
        height: 25,
        left: 35,
        top: 4,
        color: 'rgba(100, 100, 100, 0.60)'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        height: 40,
        width: DEVICE_WIDTH - 40,
        borderRadius: 20,
        zIndex: 100,
    },
});

export const LoginDetailsScreenStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,120,255,0.7)',
        height: 40,
        width: DEVICE_WIDTH - 40,
        borderRadius: 20,
        zIndex: 100,
    },
    buttonSelect: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(119,221,119,0.7)',
        height: 40,
        width: DEVICE_WIDTH - 40,
        borderRadius: 20,
        zIndex: 100,
    },
    buttonDelete: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,0,0,0.7)',
        height: 40,
        width: DEVICE_WIDTH - 40,
        borderRadius: 20,
        zIndex: 100,
    },
    inlineImg: {
        position: 'relative',
        width: 30,
        height: 30,
        bottom: 6,
        color: 'rgba(150, 150, 150, 0.90)'
    },
    buttonText: {
        color: 'rgb(255,255,255)',
    }
});

export const AnswerTypeOpenStyles = StyleSheet.create({
    input: {
        margin: 20,
        marginBottom: 0,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderColor: '#ccc',
        borderWidth: 1,
    },


})


