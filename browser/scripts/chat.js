import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';
import * as view from './view.js';
import * as log from './log.js';

function Error ({errMsg = "", errorType = 0, success = true} = {}) {
    this.errMsg = errMsg;
    this.errorType = errorType;
    this.success = success;
}

function Chat () {
    "use strict";

    const SOCKET_DEST = 'https://192.168.11.106/demo';
    const CHANNEL_COUNTRY = "/channel/country";
    const CHANNEL_ERROR = "/user/errors"
    const SEND_COUNTRY = "/chat/country";
    const SEND_AUTH = "/chat/auth";
    const COUNTRY_ID = 1;
    const ERROR_ID = 2;

    this.client = null;
    this.isConnected = function _isConnected() {
        if (this.client === null || !this.client.connected) {
            log.warn("Not connected.");
            view.setCountryChat("!!!ERROR!!!Not connected");
            return false;
        } else {
            return true;
        }
    }
    this.connect = function _connect (callback) {
        let socket = new SockJS(SOCKET_DEST);
        this.client = webstomp.over(socket);
        this.subscribes = [];
        this.client.connect({},
            function _connectCallback (frame) {
                view.setConnected(true, "");
                log.debug("Connected OK." + frame);
                if (callback) {
                    callback(true);
                }

            }, function _errorCallback (ev) {
                let err = JSON.stringify(ev);
                view.setConnected(false, err);
                log.error("Connected Error." + err);
                if (callback) {
                    callback(false);
                }
        });
    };
    this.disconnect = function _disconnect () {

        if (this.client !== null) {
            this.client.disconnect();
            if (this.subscribes.length > 0) {
                this.subscribes.forEach(function _forEach(unsubscribe, index, array) {
                    if (unsubscribe) {
                        unsubscribe();
                    }
                });
                this.subscribes = [];
            }
            view.setDisconnected(true, "");
            log.debug("Disconnected.");

        } else {
            view.setDisconnected(false, "Null client.");
            log.error("Null client.");
        }
    };
    this.countryChat = function _countryChat ({time = (new Date).toLocaleDateString(), user = "Anoymous", content = ""} = {}) {
        if (!this.isConnected()) {
            return;
        } else if (this.subscribes[COUNTRY_ID] === undefined) {
            log.debug("Not subscribe country channel yet.");
            let result = this.client.subscribe(CHANNEL_COUNTRY, function _countrySubscribe(frame) {
                if (frame) {
                    log.debug("subscribe:" + JSON.stringify(frame));
                }
            }, {id : COUNTRY_ID});
            this.subscribes[COUNTRY_ID] = result.unsubscribe;
        }
        if (content !== "") {
            this.client.send(SEND_COUNTRY, content, {});
        }
    };
    this.initError = function _initError() {
        if (this.client === null || !this.client.connected) {
            log.warn("Not connected.");
            view.setCountryChat("!!!ERROR!!!Not connected");
            return;
        } else if (this.subscribes[ERROR_ID] === undefined) {
            log.debug("Not subscribe error channel yet.");
            const pointer = this;
            let result = this.client.subscribe(CHANNEL_ERROR, function _errorSubscribe(frame) {
                if (frame) {
                    log.debug("subscribe:" + JSON.stringify(frame));
                    let error = new Error(JSON.parse(frame.body));
                    if (!error.success) {
                        pointer.dealError(error);
                    }
                }
            }, {id : ERROR_ID});
            this.subscribes[ERROR_ID] = result.unsubscribe;
        }
    };
    this.dealError = function _dealError(error) {
        switch (error.errorType) {
            case 1:
                view.setInvalidAuth(error.errMsg);
                break;

            case 2:
                view.setMultiAuth(error.errMsg);
                break;

            case 3:
                view.setUnAuth(error.errMsg);
                break;

            default:
                log.error("Invalid error type " + error.errorType);
                return;
        }
    };
    this.auth = function _auth(account) {
        if (!this.isConnected()) {
            return;
        } else if (!account) {
            return;
        }
        this.client.send(SEND_AUTH, JSON.stringify(account), {"content-type" : "application/json;charset=UTF-8"});
    }
}
const chat = new Chat();

function init() {
    "use strict";

    let enter = document.getElementById('enter');
    if (enter) {
        enter.addEventListener('keydown', function _onEnter(e) {
            if (e.keyCode === 13) {
                chat.countryChat({content : e.target.value});
                e.preventDefault();
            }
        });
    }

    let connect = document.getElementById('connect');
    if (connect) {
        connect.addEventListener('click', function _onClickConnect(e) {
            if (!e.target.disabled) {
                chat.connect(function _callback(isSuccess) {
                    if (isSuccess) {
                        chat.initError();
                    }
                });
            }
        });
    }

    let disconnect = document.getElementById('disconnect');
    if (disconnect) {
        disconnect.addEventListener('click', function _onClickDisconnect(e) {
            if (!e.target.disabled) {
                chat.disconnect();
            }
        });
    }

    let auth = document.getElementsByClassName('auth')[0];
    let cancel = document.getElementById('cancel');
    if (cancel && auth) {
        cancel.addEventListener('click', function _cancelClick(e) {
            auth.classList.add('hidden');
        });
    }
    let login = document.getElementById('login');
    if (login && auth) {
        login.addEventListener('click', function _loginClick(e) {
            let username = document.getElementById('user');
            if (!username) {
                return;
            }
            let passwordName = document.getElementById('password');
            if (!passwordName) {
                return;
            }
            let account = {
                user : username.value,
                password : passwordName.value
            }
            chat.auth(account);
            auth.classList.add('hidden');
        });
    }
}

document.addEventListener("DOMContentLoaded", init);
