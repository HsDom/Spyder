var sentRequests = {};


// Add listener for onBeforeSendHeaders
// url,method
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(requestInfo) {

        return {};
    },
    // All URLs
    { urls: ["<all_urls>"] },
    // Block request until message is sent
    ["blocking", "requestHeaders"]
);

// Add listener for onBeforeRequest
// url,method, requestHeaders, queryParams
chrome.webRequest.onBeforeRequest.addListener(
    function(requestInfo) {
        var url = new URL(requestInfo.url);
        var queryParams = Object.fromEntries(url.searchParams.entries());
        var status = requestInfo.statusCode;
        var method = requestInfo.method;

        if (requestInfo.requestBody && requestInfo.requestBody.raw) {
            var payload = String.fromCharCode.apply(null, new Uint8Array(requestInfo.requestBody.raw[0].bytes));
        }

        // Add request to sentRequests
        sentRequests[url] = {
            id: Object.keys(sentRequests).length,
            url: url,
            method: method,
            requestHeaders: requestInfo.requestHeaders,
            queryParams: queryParams,
            payload: payload
        };

        return {};
    },
    // Filters for URLs
    { urls: ["<all_urls>"] },
    // Extra information to listen for
    ["requestBody"]
);

// Add listener for onHeadersReceived
chrome.webRequest.onHeadersReceived.addListener(
    function(responseInfo) {
        // Extract response headers
        var responseHeaders = responseInfo.responseHeaders;
        // Access other response information
        var status = responseInfo.statusCode;

        // Check if url is in sentRequests
        if (sentRequests[responseInfo.url]) {
            // Update sentRequests with response headers
            sentRequests[responseInfo.url].responseHeaders = responseHeaders;
            sentRequests[responseInfo.url].status = status;
        }


        return { };
    },
    // Filters for URLs
    { urls: ["<all_urls>"] },
    // Extra information to listen for
    ["responseHeaders"]
);

// Add listener for onCompleted
// url,method, status, requestHeaders
chrome.webRequest.onCompleted.addListener(
    function(requestInfo) {

        return {};
    },
    // All URLs
    { urls: ["<all_urls>"] },
    // Block request until message is sent
    ["responseHeaders"]
);


// Load HTML file
chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL('background/index.html');
    let tab = await chrome.tabs.create({ url });
});


// On Document Load
document.addEventListener('DOMContentLoaded', function() {
});
