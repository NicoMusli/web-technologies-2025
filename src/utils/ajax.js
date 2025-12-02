import config from '../config';

/**
 * Performs an AJAX request using XMLHttpRequest.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string} url - The URL to send the request to.
 * @param {object} [data] - The data to send (will be JSON stringified).
 * @param {function} [callback] - Callback function (error, response).
 */
export const ajaxRequest = (method, url, data = null, callback) => {
    const fullUrl = url.startsWith('http') ? url : `${config.API_BASE_URL}${url}`;
    const xhr = new XMLHttpRequest();
    xhr.open(method, fullUrl, true);

    if (!(data instanceof FormData)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.withCredentials = true;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (callback) callback(null, response);
                } catch (e) {
                    if (callback) callback(e, xhr.responseText);
                }
            } else {
                if (callback) callback(new Error(`Request failed with status ${xhr.status}`), xhr.responseText);
            }
        }
    };

    xhr.onerror = function () {
        if (callback) callback(new Error('Network error'), null);
    };

    if (data) {
        if (data instanceof FormData) {
            xhr.send(data);
        } else {
            xhr.send(JSON.stringify(data));
        }
    } else {
        xhr.send();
    }
};
