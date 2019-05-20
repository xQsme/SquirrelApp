const URL_BASE = 'http://192.168.1.69:8000/api/';
/**
 * The URL for the api method to dump the entire database
 * @type {string} - URL
 */
const URL_GET_DUMP = URL_BASE + 'dump';
const URL_POST_LOGIN = URL_BASE + 'login';
const URL_POST_REGISTER = URL_BASE + 'register';
const URL_LOGOUT = URL_BASE + 'logout';


/**
 * Creates URL for the api to dump of the database after the given timestamp
 * @param timestamp - {string} - e.g. '2018-04-09 17:33:42.429859', '2018', '2018-02 or '0'
 * @returns {string} - URL
 */
const URL_DUMP_AFTER = function (timestamp) {
    return URL_GET_DUMP_AFTER + timestamp[0].date;
};

/**
 * function to query a URL
 * @param resourcePath - {string} - the URL
 * @param headers
 * @param body
 */
function get(resourcePath, headers, body) {

    return new Promise(
        function (resolve, reject) {

            fetch(resourcePath, {
                method: 'GET',
                headers: headers == null ? {} : headers,
            })
                .then((response) => {
                    if (response.status !== 200) {
                        reject(response);
                    }
                    let responseJson = response.json()
                    if (responseJson == [] || responseJson == null)
                        reject("empty response");
                    resolve(responseJson);
                })
                .catch((error) => {
                    reject(error);
                });
        });

}

function post(resourcePath, headers, body) {
    return new Promise(
        function (resolve, reject) {
            fetch(resourcePath, {
                method: 'POST',
                headers: headers == null ? {} : headers,
                body: body == null ? {} : body,
            }).then((r) => {
                resolve(r);
            })
                .catch(e => reject(e));
        });

}

export class LoginManagerApiFacade {

    /**
     * Function to get the entire content of the data base
     * @returns {Promise} - resolve gets the dump in JSON format; reject gets the error message
     */
    static dump(token) {
        return new Promise(
            function (resolve, reject) {
                get(URL_GET_DUMP,
                    {
                        //headers
                        Accept: 'application/json',
                        Authorization: "Bearer " + token,
                    }
                )
                    .then((r) => {
                        resolve(r);
                    })
                    .catch(e => reject(e));
            })
    }

    static login(email, password) {
        return new Promise(
            function (resolve, reject) {
                post(URL_POST_LOGIN,
                    {
                        //headers
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    JSON.stringify({
                        email: email,
                        password: password
                    })
                )
                    .then((r) => {
                        resolve(r);

                    })
                    .catch((e) => {
                        reject(e)
                    });
            })
    }

    static register(username, email, password) {
        return new Promise(
            function (resolve, reject) {
                post(URL_POST_REGISTER,
                    {
                        //headers
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    JSON.stringify({
                        name: username,
                        email: email,
                        password: password
                    })
                )
                    .then((r) => {
                        resolve(r);

                    })
                    .catch((e) => {
                        reject(e)
                    });
            })
    }

    static logout(token) {
        return new Promise(
            function (resolve, reject) {
                get(URL_LOGOUT,
                    {
                        //headers
                        Accept: 'application/json',
                        Authorization: "Bearer " + token,
                    }
                )
                    .then((r) => {
                        resolve();
                    })
                    .catch(e => {
                            reject(e)
                        }
                    );
            })
    }

}