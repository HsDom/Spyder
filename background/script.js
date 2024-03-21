
document.addEventListener('DOMContentLoaded', function() {
    // Get var Requests_Sent = []; from background.js
    chrome.runtime.getBackgroundPage(function(bg) {
        var Requests_Sent = bg.Requests_Sent;
        for (var i = 0; i < Requests_Sent.length; i++) {
            addTable(Requests_Sent[i].method, Requests_Sent[i].url);
        }
    });
   

    document.getElementById('save').addEventListener('click', () => {
    })
});


function addTable(method,url){
    var table = document.getElementById("requests_table");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = method;
    cell2.innerHTML = url;
}