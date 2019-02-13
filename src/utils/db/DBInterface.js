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
                + 'id                INT(11) PRIMARY KEY NOT NULL, '
                + 'title             VARCHAR(255) NOT NULL, '
                + 'description       VARCHAR(255) NOT NULL, '
                + 'active            INT(1) NOT NULL '
                + ');', []);

            tx.executeSql('INSERT INTO login VALUES '
                + '(1, "Facebook", "Social Media", 0), '
                + '(2, "Twitter", "Social Media", 1), '
                + '(3, "Google", "Various Services", 0), '
                + '(4, "Microsoft", "Various Services", 1), '
                + '(5, "Paypal", "Financial", 0), '
                + '(6, "Steam", "Games", 1), '
                + '(7, "Bank Account", "Financial", 1);', []);

            tx.executeSql('CREATE TABLE IF NOT EXISTS type ('
                + 'id                INT(11) PRIMARY KEY NOT NULL, '
                + 'title             VARCHAR(255) NOT NULL '
                + ');', []);

            tx.executeSql('INSERT INTO type VALUES '
                + '(1, "Password"), '
                + '(2, "PIN"), '
                + '(3, "SMS"), '
                + '(4, "Authenticator"), '
                + '(5, "Fingerprint");', []);

            tx.executeSql('CREATE TABLE IF NOT EXISTS key ('
                + 'id                INT(11) PRIMARY KEY NOT NULL, '
                + 'id_login          INT(11) NOT NULL, '
                + 'id_type           INT(11) NOT NULL, '
                + 'active            INT(1) NOT NULL, '
                + 'FOREIGN KEY(id_login) REFERENCES login(id), '
                + 'FOREIGN KEY(id_type) REFERENCES type(id) '
                + ');', []);

            tx.executeSql('INSERT INTO key VALUES '
                + '(1, 7, 1, 1), '
                + '(2, 7, 2, 1), '
                + '(3, 7, 3, 0), '
                + '(4, 7, 4, 1), '
                + '(5, 7, 5, 0);', []);
        });
    }

    static dropTables() {
        DBInterface.db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS login;');
            tx.executeSql('DROP TABLE IF EXISTS type;');
            tx.executeSql('DROP TABLE IF EXISTS key;');
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

                for (let i = 0; i < dump.login.length; i++) {
                    tx.executeSql('INSERT OR REPLACE INTO login (id, title, description, active) '
                        + ' VALUES (\"' + dump.login[i].id + '\", \"' + dump.login[i].title + '\",'
                        + ' \"' + dump.login[i].description + '\", \"' + dump.login[i].active + '\");');
                }

                for (let i = 0; i < dump.type.length; i++) {
                    tx.executeSql('INSERT OR REPLACE INTO type (id, title) '
                        + ' VALUES (\"' + dump.type[i].id + '\", \"' + dump.type[i].title + '\");');
                }

                for (let i = 0; i < dump.key.length; i++) {
                    tx.executeSql('INSERT OR REPLACE INTO key (id, id_login, id_type, active) '
                        + ' VALUES (\"' + dump.key[i].id + '\", \"' + dump.key[i].id_login + '\", \"' + 
                        dump.key[i].id_type + '\", \"' + dump.key[i].active + '\");');
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