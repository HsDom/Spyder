var requestsTable = [];

// On Document Load
document.addEventListener('DOMContentLoaded', function() {
    // On Initial Page Load
    chrome.runtime.getBackgroundPage(function(backgroundPage) {
        // Clear requestsTable
        requestsTable = [];
        var sentRequests = backgroundPage.sentRequests;
        for (var i = 0; i < sentRequests.length; i++) {
            // Add request to requestsTable
            requestsTable.push(sentRequests[i]);
            addTableRow(i, sentRequests[i].method, sentRequests[i].url, "WIP", "WIP");
        }
    });


    // Refresh the table every 5 seconds
    setInterval(function() {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
            var sentRequests = backgroundPage.sentRequests;
            for (var i = 0; i < sentRequests.length; i++) {
                // Check if request is already in requestsTable
                if (requestsTable.includes(sentRequests[i])) {
                    continue;
                }
                // Add request to requestsTable
                requestsTable.push(sentRequests[i]);
                addTableRow(i, sentRequests[i].method, sentRequests[i].url, "WIP", "WIP");
            }
        });
    }, 1000);
});

function addTableRow(id, method, url, status, type) {
    var table = document.getElementById("requests_table");
    var tbody = table.getElementsByTagName('tbody')[0];
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.textContent = id;
    tr.appendChild(td1);

    const td2 = document.createElement('td');
    td2.textContent = method;
    tr.appendChild(td2);

    const td3 = document.createElement('td');
    td3.textContent = url;
    tr.appendChild(td3);

    const td4 = document.createElement('td');
    td4.textContent = status;
    tr.appendChild(td4);

    const td5 = document.createElement('td');
    td5.textContent = type;
    tr.appendChild(td5);

    tbody.appendChild(tr);
}
