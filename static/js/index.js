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

function splitText(terms) {
    let optional_options = {};
    let sentences = tokenizer.sentences(terms, optional_options);
    console.log(sentences)
    return sentences
}

async function handleAnalyseTerms(event) {
    // form data
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let terms = formData.get("terms")
    let clauses = splitText(terms);

    // Prepare result 
    let alert = document.getElementById("empty-alert");
    let results = document.getElementById("results");
    results.innerHTML = "";

    // model
    let tokenizer = await AutoTokenizer.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let model = await AutoModelForSequenceClassification.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    for (let clause in clauses) {
        let input_ids = tokenizer(clauses[clause], {padding: true, truncation: true});
        let outputs = await model(input_ids);
        let normResults = sigmoid(outputs.logits.data)

        alert.classList.add("visually-hidden");
        results.classList.remove("visually-hidden");

        let html = `
        <div class="card mb-3 ${normResults.some(x => x > 0.5) ? "border-primary bg-color-card" : ""}">
            <div class="card-body">
                <p id="clause" class="card-text ${normResults.some(x => x > 0.5) ? "fw-bold" : ""}">${clauses[clause]}</p>
            </div>
            <div class="card-footer text-muted">
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[0] < 0.5 ? "btn-opacity" : ""}">
            Limitation of liability
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[0] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span>
            </button>
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[1] < 0.5 ? "btn-opacity" : ""}">
                Unilateral termination
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[1] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[2] < 0.5 ? "btn-opacity" : ""}">
                Unilateral change
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[2] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[3] < 0.5 ? "btn-opacity" : ""}">
                Content removal
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[3] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[4] < 0.5 ? "btn-opacity" : ""}">
            Contract by using
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[4] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[5] < 0.5 ? "btn-opacity" : ""}">
            Choice of law
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[5] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[6] < 0.5 ? "btn-opacity" : ""}">
            Jurisdiction
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[6] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${normResults[7] < 0.5 ? "btn-opacity" : ""}">
            Arbitration
                <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
                    ${(normResults[7] * 100).toFixed(2)}%
                    <span class="visually-hidden">percentage</span>
                </span >
            </button >
            </div>
        </div>`;

        let card = parseHTML(html);
        results.appendChild(card);
    }

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

async function main() {

    let sendTos = document.getElementById("form-send-tos");
    sendTos.onsubmit = handleAnalyseTerms;
}

document.addEventListener("DOMContentLoaded", main);