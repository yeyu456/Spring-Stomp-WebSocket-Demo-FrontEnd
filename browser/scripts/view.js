
export function setConnected(isSuccess, errMsg) {
    "use strict";

    document.getElementById('connected').disabled = isSuccess;
    if (errMsg !== "") {
        alert(errMsg);
    }
}

export function setDisconnected(isSuccess, errMsg) {
    "use strict";

    document.getElementById('disconnected').disabled = isSuccess;
    if (errMsg !== "") {
        alert(errMsg);
    }
}

export function setCountryChat (content) {
    "use strict";

    let contentElement = document.getElementById('cotent');
    contentElement.text = cotent;
}
