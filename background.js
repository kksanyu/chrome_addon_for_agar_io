/**
 * chrome.webRequest.onBeforeSendHeaders
 * 修改请求头, 伪造正常客户端
 */
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    if (details.initiator == 'https://agar.example.com') {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Origin') {
                details.requestHeaders[i].value = 'https://agar.io';
            } else if (details.requestHeaders[i].name === 'Referer') {
                details.requestHeaders[i].value = 'https://agar.io/';
            }
        }
    }
    return {
        requestHeaders: details.requestHeaders
    };
}, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders", "extraHeaders"]);

/**
 * chrome.webRequest.onBeforeRequest
 * 修改请求体, 伪造正常参数
 */
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (details.url.indexOf('https%3A%2F%2Fagar.example.com') > -1) {
        details.url = details.url.replace('https%3A%2F%2Fagar.example.com', 'https%3A%2F%2Fagar.io');
        return {
            redirectUrl: details.url
        }
    } else if (details.url.indexOf('domain=agar.example.com') > -1) {
        details.url = details.url.replace('domain=agar.example.com', 'domain=agar.io');
        return {
            redirectUrl: details.url
        }
    }
}, {urls: ["<all_urls>"]}, ["blocking"]);

/**
 * chrome.webRequest.onHeadersReceived
 * 修改响应头, 追加跨域支持
 */
chrome.webRequest.onHeadersReceived.addListener(function(details) {
    
    if (details.initiator == 'https://agar.example.com') {
        let isOk = false;
        for (var i = 0; i < details.responseHeaders.length; i++) {
            if (details.responseHeaders[i].name.toLowerCase() === 'Access-Control-Allow-Origin'.toLowerCase()) {
                details.responseHeaders[i].value = 'https://agar.example.com';
                isOk = true;
                break;
            }
        }

        if (isOk == false) {
            details.responseHeaders.push({
                name: 'Access-Control-Allow-Origin',
                value: 'https://agar.example.com'
            });
        }
    }

    return {
        responseHeaders: details.responseHeaders
    };

},{urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);
