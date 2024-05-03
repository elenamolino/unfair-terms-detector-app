"use strict";


function handleAnalyseTerms(event) {
    // call model

    console.log("call model")
    let results = document.getElementById("results");
    
}

function main() {
    console.log("hello world")

    let sendTos = document.getElementById("form-send-tos");
    sendTos.onsubmit = handleAnalyseTerms;

}

document.addEventListener("DOMContentLoaded", main);