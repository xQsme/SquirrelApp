import SQLite from 'react-native-sqlite-storage';

//SQLite.DEBUG(true);
//SQLite.enablePromise(false);

export class DBInterface {

    static db = " ";

    static openDBConnection() {
        DBInterface.db = SQLite.openDatabase({name: 'LoginManager.db', location: 'default'});
    }

    static createTables() {
        DBInterface.db.transaction((tx) => {
            //Create tables
            tx.executeSql('CREATE TABLE IF NOT EXISTS login ('
                + 'id       INTEGER PRIMARY KEY, '
                + 'source   VARCHAR(255) NOT NULL, '
                + 'ip       VARCHAR(255) NOT NULL, '
                + 'date     VARCHAR(255) NOT NULL, '
                + 'time     VARCHAR(255) NOT NULL '
                + ');', []);
        });
    }

    static dropTables() {
        DBInterface.db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS login;');
        });
    }


    static executeQuery(query, where) {
        return new Promise(
            function (resolve, reject) {
                DBInterface.db.transaction((tx) => {
                    tx.executeSql(query, (where == null ? [] : where), (tx, results) => {
                        let result = new Array(results.rows.length).fill(0).map((currentValue, index) => results.rows.item(index));
                        resolve(result);
                    });
                });
            }
        );
    }

    static executeInsert(query) {
        return new Promise(
            function (resolve, reject) {
                DBInterface.db.transaction((tx) => {
                    tx.executeSql(query);
                }, () => {
                    //erro
                    reject("Erro");
                }, () => {
                    //success
                    resolve("Done");
                });
            }
        );
    }

    static insertDump(dump) {
        return new Promise(function (resolve, reject) {

            DBInterface.db.transaction((tx) => {

                for (let i = 0; i < dump.length; i++) {
                    console.log(dump[i]);
                    tx.executeSql('INSERT OR REPLACE INTO login (source, ip, date, time) '
                        + ' VALUES (\"' + dump[i].source + '\", \"' + dump[i].ip + '\",'
                        + ' \"' + dump[i].date + '\", \"' + dump[i].time + '\");');
                }
    
            }, () => {
                //erro
                reject("Erro");
            }, () => {
                //sucesso
                resolve("Ok")
            });
        });
    }

}