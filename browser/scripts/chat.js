import {SockJS as sock} from 'sockjs-client';
import {webstomp as stomp} from 'webstomp-client';
import view from './view.js';
import log from './log.js';

function Chat () {
    "use strict";

    const SOCKET_DEST = 'http://127.0.0.1/demo';
    const CHANNEL_COUNTRY = "/channel/country";
    const SEND_COUNTRY = "/chat/country";
    const COUNTRY_ID = 1;

    this.client = null;
    this.connect = function _connect (callback) {
        let socket = new sock(SOCKET_DEST);
        this.client = stomp.over(socket);
        this.client.connect({},
            function _connectCallback () {
                view.setConnected(true, "");
                log.debug("Connected OK.");
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
    this.countryChat = function _countryChat ({time = Date.now().toLocaleDateString(), user = "Anoymous", content = ""} = {}) {
        if (this.client === null || !this.client.connected) {
            log.warn("Not connected.");
            view.setCountryChat("!!!ERROR!!!Not connected");
            return;
        } else if (this.client.subscriptions[COUNTRY_ID] === undefined) {
            log.debug("Not subscribe country channel yet.");
            this.client.subscribe(CHANNEL_COUNTRY, function _countrySubscribe(frame) {
                if (frame) {
                    log.debug(JSON.stringify(frame));
                }
            });
        }
        if (content !== "") {
            this.client.send(SEND_COUNTRY, content);
        }
    };
}

let chat = new Chat();
