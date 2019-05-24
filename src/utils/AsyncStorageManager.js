import {AsyncStorage} from "react-native";

let userEmail = null;
let userId = null;
let userName = null;
let userToken = null;
let userPin = null;

export class AsyncStorageManager {

    static storeOnAssyncStorage(email, username, user_id, token) {
        AsyncStorage.setItem("@LoginManager" + ':email', email)
            .then(() => {
            })
            .catch((error) => {
            });
        AsyncStorage.setItem("@LoginManager" + ':username', username)
            .then(() => {
            })
            .catch((error) => {
            });
        AsyncStorage.setItem("@LoginManager" + ':user_id', user_id)
            .then(() => {
            })
            .catch((error) => {
            });
        AsyncStorage.setItem("@LoginManager" + ':token', token)
            .then(() => {
            })
            .catch((error) => {
            });
    }


    static getUserId() {
        return new Promise(
            function (resolve, reject) {
                if (userId == null) {
                    AsyncStorage.getItem("@LoginManager" + ":user_id")
                        .then((user_id) => {
                            userId = user_id;
                            resolve(userId);
                        }).catch((e) => {
                        reject(e)
                    });
                } else {
                    resolve(userId);
                }
            });
    }

    static getUserToken() {
        return new Promise(
            function (resolve, reject) {
                if (userToken == null) {
                    AsyncStorage.getItem("@LoginManager" + ":token")
                        .then((token) => {
                            userToken = token;
                            resolve(userToken);
                        }).catch((e) => {
                        reject(e)
                    });
                } else {
                    resolve(userToken);
                }
            });
    }

    static getUserUsername() {
        return new Promise(
            function (resolve, reject) {
                if (userName == null) {
                    AsyncStorage.getItem("@LoginManager" + ":username")
                        .then((username) => {
                            userName = username;
                            resolve(userName);
                        }).catch((e) => {
                        reject(e)
                    });
                } else {
                    resolve(userName);
                }
            });
    }

    static getUserEmail() {
        return new Promise(
            function (resolve, reject) {
                if (userEmail == null) {
                    AsyncStorage.getItem("@LoginManager" + ":email")
                        .then((email) => {
                            userEmail = email;
                            resolve(userEmail);
                        }).catch((e) => {
                        reject(e)
                    });
                } else {
                    resolve(userEmail);
                }
            });
    }

    static getUserPin() {
        return new Promise(
            function (resolve, reject) {
                if (userPin == null) {
                    AsyncStorage.getItem("@LoginManager" + ":pin")
                        .then((pin) => {
                            userPin = pin;
                            resolve(userPin);
                        }).catch((e) => {
                        reject(e)
                    });
                } else {
                    resolve(userPin);
                }
            });
    }
    
    static setUserPin(pin) {
        AsyncStorage.setItem("@LoginManager" + ':pin', pin)
            .then(() => {
            })
            .catch((error) => {
            });
    }

    static clearUserData() {
        return new Promise(
            function (resolve, reject) {
                AsyncStorage.clear()
                    .then(() => {
                        userEmail = null;
                        userId = null;
                        userName = null;
                        userToken = null;
                        resolve();
                    }).catch((e) => {
                    reject(e);
                });
            });
    }
}