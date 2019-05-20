import {DBInterface} from "./DBInterface";
import {AsyncStorageManager} from "../AsyncStorageManager";

export class DBQueryHelper {

    static loginQuery() 
    {
        return new Promise(
            function (resolve, reject) {
                let query =
                    'select id , source, ip, date,  time ' +
                    'FROM login'

                DBInterface.executeQuery(query)
                    .then(r => {
                        resolve(r);
                    }).catch((e) => {
                        reject(e);
                });
            });
    }

}