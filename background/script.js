var requestsTable = {};

// On Document Load
document.addEventListener('DOMContentLoaded', function() {
    // Toggle visiblity
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
        });
    }

    // On Initial Page Load
    chrome.runtime.getBackgroundPage(function(backgroundPage) {
        // Clear requestsTable
        requestsTable = {};
        var sentRequests = backgroundPage.sentRequests;
        for (var key in sentRequests) {
            var request = sentRequests[key];
            var id = request.id;
            var method = request.method;
            var url = request.url;
            var status = request.status;
            var type = "Unknown";
            for (var key in request.responseHeaders) {
                var header = request.responseHeaders[key];
                if (header["name"] == "content-type") {
                    type = header["value"];
                    break;
                }
            }
            addTableRow(id, method, url, status, type);
            requestsTable[id] = request;
        }
    });


    // Refresh the table every 5 seconds
    setInterval(function() {
        chrome.runtime.getBackgroundPage(function(backgroundPage) {
            var sentRequests = backgroundPage.sentRequests;
            for (var key in sentRequests) {
                var request = sentRequests[key];
                if (!requestsTable[request.id]) {
                    var id = request.id;
                    var method = request.method;
                    var url = request.url;
                    var status = request.status;
                    var type = "Unknown";
                    for (var key in request.responseHeaders) {
                        var header = request.responseHeaders[key];
                        if (header["name"] == "content-type") {
                            type = header["value"];
                            break;
                        }
                    }
                    addTableRow(id, method, url, status, type);
                    requestsTable[id] = request;
                }
            }
        });
    }, 1000);
});





function addTableRow(id, method, url, status, type) {
    var table = document.getElementById("requests_table");
    var tbody = table.getElementsByTagName('tbody')[0];
    const tr = document.createElement('tr');
    // Add click listener to tr
    tr.addEventListener('click', function() {
        // Loop through all rows and remove active id
        var rows = table.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            rows[i].classList.remove('active');
        }
        // Add active id to clicked row
        tr.classList.add('active');

        // Add info to responseHeaders id
        var responseHeaders = document.getElementById("responseHeaders");
        responseHeaders.innerHTML = "";
        var request = requestsTable[id];

        //request.responseHeaders
        for (var key in request.responseHeaders) {
            var header = request.responseHeaders[key];
            // Create <p>
            var p = document.createElement('p');
            p.textContent = header["name"] + ": " + header["value"];
            responseHeaders.appendChild(p);
        }
    });

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
