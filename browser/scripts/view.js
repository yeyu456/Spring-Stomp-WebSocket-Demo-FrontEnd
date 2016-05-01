
export function setConnected(isSuccess, errMsg) {
    "use strict";

    if (errMsg !== "") {
        alert(errMsg);
    } else {
        document.getElementById('connect').disabled = isSuccess;
    }
}

export function setDisconnected(isSuccess, errMsg) {
    "use strict";

    if (errMsg !== "") {
        alert(errMsg);
    } else {
        document.getElementById('disconnect').disabled = isSuccess;
    }
}

export function setCountryChat (content) {
    "use strict";
    let contentElement = document.getElementById('id');
    console.log("content:" + content);
}
