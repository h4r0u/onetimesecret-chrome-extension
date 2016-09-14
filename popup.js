var APIToken;
var customerID;
var APIURI = 'https://onetimesecret.com/api/v1/';

document.addEventListener('DOMContentLoaded', function () {
    loadDataUser();
    var cryptButton = document.getElementById('crypt');
    cryptButton.addEventListener('click', function () {
        var secret = document.getElementById('text-to-crypt').value;
        shareSecret(secret);
    }, false);

    var apiButton = document.getElementById('api');
    apiButton.addEventListener('click', function () {
        var token = document.getElementById('token').value;
        var username = document.getElementById('username').value;
        storeKeys(token, username);
    }, false);

    var hideButton = document.getElementById('close-result');
    hideButton.addEventListener('click', function () {
        document.getElementById('form-crypt').style.display = 'block';
        document.getElementById('div-result').style.display = 'none';
    }, false);

    var copyButton = document.getElementById('copy-clip');
    copyButton.addEventListener('click', function () {
        var text = document.getElementById('result').innerHTML;
        copyTextToClipboard(text);
    }, false);

}, false);

function loadDataUser() {
    chrome.storage.local.get(['APIToken', 'customerID'], function (items) {
        if (typeof items.APIToken != 'undefined' && typeof items.customerID != 'undefined') {
            APIToken = items.APIToken;
            customerID = items.customerID;
            document.getElementById('token').value = APIToken;
            document.getElementById('username').value = customerID;
        } else {
            document.getElementById('token').value = '';
            document.getElementById('username').value = '';
        }
    });
}

function storeKeys(token, id) {
    if (token != '' && id != '') {
        chrome.storage.local.set({'APIToken': token, 'customerID': id}, function () {
            loadDataUser();
        });
    }
}

function shareSecret(toShare) {
    if (toShare != '' && customerID != undefined && APIToken != undefined) {
        var xhr = new XMLHttpRequest();
        var postdata = 'secret=' + encodeURIComponent(toShare);
        xhr.open("POST", APIURI + 'share', true);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(customerID + ':' + APIToken));
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                document.getElementById('result').innerHTML = 'https://onetimesecret.com/secret/' + resp.secret_key;
                document.getElementById('form-crypt').style.display = 'none';
                document.getElementById('div-result').style.display = 'block';

            }
        }
        xhr.send(postdata);
    }
}

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
}