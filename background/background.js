var Requests_Sent = [];

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
        // Access request headers from info object
        var requestHeaders = info.requestHeaders;

        // Send message to content.js
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                url: info.url,
                method: info.method,
                headers: requestHeaders
            });
        });

        // Add request to Requests_Sent
        Requests_Sent.push({
            url: info.url,
            method: info.method
        });
        return {requestHeaders: requestHeaders};
    },
    //All URLs
    { urls: ["<all_urls>"] },
    //Block request until message is sent
    ["blocking", "requestHeaders"]
);