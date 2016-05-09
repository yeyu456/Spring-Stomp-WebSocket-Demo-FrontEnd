
export function setConnected (isSuccess, errMsg) {
    "use strict";

    if (errMsg !== "") {
        alert(errMsg);
    } else {
        document.getElementById('connect').disabled = isSuccess;
    }
}

export function setDisconnected (isSuccess, errMsg) {
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

export function setInvalidAuth (errMsg) {
    "use strict";

    alert("Invalid auth:" + errMsg);
    let auth = document.getElementsByClassName('auth')[0];
    if (auth) {
        auth.classList.remove('hidden');
    }
}

export function setMultiAuth (errMsg) {
    "use strict";

    alert("Multiple auth:" + errMsg);
    let auth = document.getElementsByClassName('auth')[0];
    if (auth) {
        auth.classList.remove('hidden');
    }
}

export function setUnAuth (errMsg) {
    "use strict";

    alert("Not auth yet:" + errMsg);
    let auth = document.getElementsByClassName('auth')[0];
    if (auth) {
        auth.classList.remove('hidden');
    }
}
