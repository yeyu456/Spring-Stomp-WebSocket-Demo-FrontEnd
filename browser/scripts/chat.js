import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';
import * as view from './view.js';
import * as log from './log.js';

function Chat () {
    "use strict";

    const SOCKET_DEST = 'http://192.168.11.106/demo';
    const CHANNEL_COUNTRY = "/channel/country";
    const SEND_COUNTRY = "/chat/country";
    const COUNTRY_ID = 1;

    this.client = null;
    this.connect = function _connect (callback) {
        let socket = new SockJS(SOCKET_DEST);
        this.client = webstomp.over(socket);
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
            this.subscribes = [];
            view.setDisconnected(true, "");
            log.debug("Disconnected.");

        } else {
            view.setDisconnected(false, "Null client.");
            log.error("Null client.");
        }
    };
    this.countryChat = function _countryChat ({time = (new Date).toLocaleDateString(), user = "Anoymous", content = ""} = {}) {
        if (this.client === null || !this.client.connected) {
            log.warn("Not connected.");
            view.setCountryChat("!!!ERROR!!!Not connected");
            return;
        } else if (this.client.subscriptions[COUNTRY_ID] === undefined) {
            log.debug("Not subscribe country channel yet.");
            this.client.subscribe(CHANNEL_COUNTRY, function _countrySubscribe(frame) {
                if (frame) {
                    log.debug("subscribe:" + JSON.stringify(frame));
                }
            }, {id : COUNTRY_ID});
        }
        if (content !== "") {
            this.client.send(SEND_COUNTRY, content, {});
        }
    };
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
                chat.connect();
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
}

document.addEventListener("DOMContentLoaded", init);
