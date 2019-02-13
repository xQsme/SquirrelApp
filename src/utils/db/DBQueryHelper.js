import {DBInterface} from "./DBInterface";
import {AsyncStorageManager} from "../AsyncStorageManager";

export class DBQueryHelper {

    static loginQuery() 
    {
        return new Promise(
            function (resolve, reject) {
                let query =
                    'select l.id as id, l.title, l.description as description, l.active as active,  COUNT(DISTINCT k.id) as total ' +
                    'FROM login l LEFT JOIN key k ON l.id = k.id_login ' +
                    'GROUP BY l.id, l.title, l.description, l.active ' + 
                    'ORDER BY l.title';

                DBInterface.executeQuery(query)
                    .then(r => {
                        resolve(r);
                    }).catch((e) => {
                        reject(e);
                });
            });
    }

    static keyQuery(idLogin) 
    {
        return new Promise(
            function (resolve, reject) {

                let query =
                    'SELECT t.title as title, k.active as active FROM key k JOIN type t ON t.id = k.id_type ' + 
                    'WHERE k.id_login = ' + idLogin;

                DBInterface.executeQuery(query)
                    .then(r => {
                        resolve(r);

                    }).catch((e) => {
                    reject(e);
                });

            });
    }

    static typeQuery(idUser) 
    {
        return new Promise(
            function (resolve, reject) {

                let query =
                    'SELECT * ' +
                    'FROM type ';

                DBInterface.executeQuery(query)
                    .then(r => {
                        resolve(r);

                    }).catch((e) => {
                    reject(e);
                });

            });
    }

    /*
    static insertAnswer(temp_id, id_option)
    {
        return new Promise(
            function (resolve, reject) {
                let query =
                    'INSERT OR REPLACE INTO answer_temp ' + 
                    '(id_answered_survey_temp, id_option) ' +
                    'VALUES (\"' + temp_id + '\" , \"' + id_option + '\");';
                DBInterface.executeInsert(query)
                    .then(r => {
                        resolve(r);
                    }).catch((e) => {
                    reject(e);
                });
            });
            
    }

    static updateScore(temp_id, score)
    {
        return new Promise(
            function (resolve, reject) {
                let query = 'UPDATE answered_survey_temp ' + 
                            'SET score = ' + score +
                            ' WHERE id = ' + temp_id + ';';
                DBInterface.executeInsert(query)
                    .then(res => {
                        resolve(res);
                    }).catch((e) => {
                    reject(e);
                });
        });
    }

    static deleteInfo(temp_id) {
        return new Promise(
            function (resolve, reject) {
                let query =
                    'DELETE FROM info_temp where id_answered_survey_temp = ' + temp_id;
                DBInterface.executeQuery(query)
                    .then(r => {
                        resolve(r);
                    }).catch((e) => {
                    reject(e);
                });
            });
    }*/

}