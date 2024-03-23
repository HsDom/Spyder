var sentRequests = [];

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(requestInfo) {
        // Access request headers from info object
        var requestHeaders = requestInfo.requestHeaders;
        var status = requestInfo.statusCode;

        // Send message to content.js
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                url: requestInfo.url,
                method: requestInfo.method
            });
        });

        // Add request to sentRequests
        sentRequests.push({
            url: requestInfo.url,
            method: requestInfo.method
        });
        return {requestHeaders: requestHeaders};
    },
    // All URLs
    { urls: ["<all_urls>"] },
    // Block request until message is sent
    ["blocking", "requestHeaders"]
);



// Load HTML file
chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL('background/index.html');
    let tab = await chrome.tabs.create({ url });
});


// On Document Load
document.addEventListener('DOMContentLoaded', function() {
});
