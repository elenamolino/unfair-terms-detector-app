"use strict";

import { AutoModelForSequenceClassification, AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";

function softmax(arr) {
    return arr.map(function (value, index) {
        return Math.exp(value) / arr.map(function (y /*value*/) { return Math.exp(y) }).reduce(function (a, b) { return a + b })
    })
}

function sigmoid(arr) {
    return arr.map((x) => 1 / (1 + Math.exp(-x)));
}

function parseHTML(str) {
    let tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp.body.children[0];
}

async function handleAnalyseTerms(event) {
    // form data
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let terms = formData.get("terms")
    console.log(terms)


    // model
    let tokenizer = await AutoTokenizer.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let model = await AutoModelForSequenceClassification.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let input_ids = await tokenizer(terms);
    let outputs = await model(input_ids);
    let normResults = sigmoid(outputs.logits.data)
    console.log(normResults)

    // result 
    let alert = document.getElementById("empty-alert");
    alert.classList.add("visually-hidden");

    let results = document.getElementById("results");
    results.classList.remove("visually-hidden");
    results.innerHTML = "";

    let html = `
        <div class="card mb-3">
            <div class="card-body">
                <p id="clause" class="card-text">${terms}</p>
            </div>
            <div class="card-footer text-muted">
                <span class="me-2 badge bg-primary rounded-pill ${normResults[0] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[0] * 100).toFixed(2)}%" >Limitation of liability</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[1] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[1] * 100).toFixed(2)}%">Unilateral termination</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[2] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[2] * 100).toFixed(2)}%">Unilateral change</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[3] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[3] * 100).toFixed(2)}%">Content removal</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[4] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[4] * 100).toFixed(2)}%">Contract by using</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[5] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[5] * 100).toFixed(2)}%">Choice of law</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[6] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[6] * 100).toFixed(2)}%">Jurisdiction</span>
                <span class="me-2 badge bg-primary rounded-pill ${normResults[7] < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip"
                    title="${(normResults[7] * 100).toFixed(2)}%">Arbitration</span>
            </div>
        </div>`;

    let card = parseHTML(html);
    results.appendChild(card);

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function main() {
    console.log("hello world");

    let sendTos = document.getElementById("form-send-tos");
    sendTos.onsubmit = handleAnalyseTerms;
}

document.addEventListener("DOMContentLoaded", main);