import {SockJS as sock} from 'sockjs-client';
import {webstomp as stomp} from 'webstomp-client';
import view from './view.js';
import log from './log.js';

function Chat () {
    this.client = null;
    this.connect = function _connect (callback) {
        let socket = new sock('http://127.0.0.1/demo');
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
        if (this.client != null) {
            this.client.disconnect();
            view.setDisconnected(true, "");
            log.debug("Disconnected.");

        } else {
            view.setDisconnected(false, "Null client.");
            log.error("Null client.");
        }
    };
    this.countryChat = function _countryChat () {
        if (this.client == null || !this.client.connected) {
            log.warn("Not connected.");
            this.connected();
        }
    }

}
