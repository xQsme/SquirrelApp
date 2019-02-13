import {DBQueryHelper} from "./db/DBQueryHelper";
import {Alert} from "react-native";
import {Care4Value2CareApiFacade} from "./facades/Care4Value2CareApiFacade";
import {DBInterface} from "./db/DBInterface";
import {AsyncStorageManager} from "./AsyncStorageManager";

export class DataSubmission {

    static handleSubmission() {
        //get the token to submit
        AsyncStorageManager.getUserToken()
            .then((token) => {
                AsyncStorageManager.getUserId()
                    .then((uid) =>{
                        //get the data to submit
                        DBQueryHelper.getDataToSubmit(uid).then((r) => {
                            let surveys = r.filter(i => (i.answer === 'undefined'
                                && i.id_survey_question === 'undefined'
                                && i.id_answer_type === 'null'));
                            let answers = r.filter(i => !(i.answer === 'undefined'
                                && i.id_survey_question === 'undefined'
                                && i.id_answer_type === 'null'
                                || i.answer === ''));


                            surveys = Array.isArray(surveys) ? surveys : [surveys];
                            answers = Array.isArray(answers) ? answers : [answers];


                            Care4Value2CareApiFacade.submitAnswers(surveys, answers, token)
                                .then((response) => {
                                    //console.log(response._bodyText);
                                    //If the data was saved successfuly delete from the system table
                                    if (response.status === 200) {
                                        //Generate arrays to do the delete query
                                        let idSurveyArr = surveys.map(s => (s.id_survey));
                                        let idUserWhoAnswersArr = surveys.map(s => (s.id_logged_user));
                                        let idUserWhomIsAnsweredArr = surveys.map(s => (s.id_user_whom_is_answered));
                                        let dateArr = surveys.map(s => (s.date));
                                        //------------------------------------------
                                        DBQueryHelper.deleteSubmitedData(idSurveyArr, idUserWhoAnswersArr, idUserWhomIsAnsweredArr, dateArr)
                                            .then((r) => {
                                                DBQueryHelper.getLastTimestamp()
                                                    .then((timestamp) => {
                                                        Care4Value2CareApiFacade.dumpAfter(timestamp, token)
                                                            .then((responseJson) => {
                                                                DBInterface.insertDump(responseJson)
                                                                    .then((r) => {
                                                                    }).catch((e) => {
                                                                })
                                                            })
                                                    });
                                            });
                                    } else {
                                        //If the data was not saved put the data to submit on a waiting line
                                        Alert.alert(
                                            'Erro',
                                            'Erro ao fazer upload para o servidor. ' + response._bodyText.toString(),
                                            [
                                                {text: 'Ok'},
                                            ],
                                            {cancelable: false}
                                        );
                                    }
                                })
                        })
                    })

            })

    }
}
