function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
} 

let a = httpGet('/data')

window.onload = function() {
    let a = httpGet('/data')
    a = JSON.parse(a) 
    document.getElementById('titulo').innerHTML = a.user + " " + a.pass
}

