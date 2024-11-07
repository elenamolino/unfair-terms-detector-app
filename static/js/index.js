import { Clause } from './model/clause.js';
import { handleRadioChange, handleCheckboxChange, handleRangeChange } from './utils/filter.js'

var myModelExecution;
var resultsList;
var resultsListFiltrada;

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

function prepareResults() {
    let alert = document.getElementById("empty-alert");
    let results = document.getElementById("results");
    let btnAnalyse = document.getElementById("analyse");
    let btnDownload = document.getElementById("download-json");
    let filterForm = document.getElementById("filter-terms");

    filterForm.classList.add("visually-hidden");
    results.innerHTML = "";
    alert.innerHTML = "";
    alert.classList.remove("visually-hidden");
    btnAnalyse.classList.add("disabled");
    btnDownload.classList.add("disabled");
    let htmlLoading = `<p class='alert alert-danger'>
    Terms are being processed, this will take a few minutes, please be patient!</p>`;

    let htmlSpinnerLoader = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Analysing terms`;
    let alertLoading = parseHTML(htmlLoading);
    alert.appendChild(alertLoading);
    btnAnalyse.innerHTML = htmlSpinnerLoader;
}

function addTooltip(){
    console.log("Tooltip")
    console.log(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

function buttonHTML(buttonName, value, explanation) {
    return `
    <button type="button" class="btn btn-sm btn-primary position-relative me-4 my-2 ${value < 0.5 ? "btn-opacity" : ""}" data-bs-toggle="tooltip" data-bs-placement="top"
data-bs-title="${explanation}" data-bs-custom-class="custom-tooltip">
        ${buttonName}
        <span class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-secondary">
            ${(value * 100).toFixed(2)}%
            <span class="visually-hidden">percentage</span>
        </span>
    </button>`;
}

function printResults(r) {

    let alert = document.getElementById("empty-alert");
    let results = document.getElementById("results");
    let btnAnalyse = document.getElementById("analyse");
    let btnDownload = document.getElementById("download-json");
    let filterForm = document.getElementById("filter-terms");

    let htmlClauses = '';
    if (r.length === 0) {
        htmlClauses = `<div>No terms with these conditions</div>`;
    } else {
        r.forEach(clause => {
            htmlClauses += `
            <div class="card mb-3 ${clause.isUnfair ? "border-primary bg-color-card" : ""}">
                <div class="card-body">
                    <p id="clause" class="card-text ${clause.isUnfair ? "fw-bold" : ""}">${clause.term}</p>
                </div>
                <div class="card-footer text-muted">
                    ${buttonHTML('Liability', clause.ltd, "To restrict the amount or type of damages that a party may claim")}
                    ${buttonHTML('Termination', clause.ter, "Unilaterally terminate contract or access to service")}
                    ${buttonHTML('Change', clause.ch, "Unilaterally modify contract or service")}
                    ${buttonHTML('C. Removal', clause.cr, "Unilaterally remove the consumer's content")}
                    ${buttonHTML('Contract by using', clause.use, "Use of the service implies acceptance of the agreement")}
                    ${buttonHTML('Law', clause.law, "Selection of a foreign law to govern the ToS")}
                    ${buttonHTML('Jurisdiction', clause.j, "Designating a foreign jurisdiction for resolving consumer disputes")}
                    ${buttonHTML('Arbitration', clause.a, "Requires arbitration before legal action can be initiated")}
                </div>
            </div>`;
        });
    }
    results.innerHTML = htmlClauses;
    alert.classList.add("visually-hidden");
    filterForm.classList.remove("visually-hidden");
    results.classList.remove("visually-hidden");
    btnDownload.classList.remove("disabled");
    btnAnalyse.classList.remove("disabled");
    btnAnalyse.innerHTML = "Analyse terms";
    addTooltip()
}

async function handleAnalyseTerms(event) {
    // form data
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let terms = formData.get("terms")
    let clauses = splitText(terms);
    prepareResults();

    // model
    myModelExecution.postMessage(clauses);
}

function handleDownloadJSON(event) {
    console.log("imprimiendo")
    const jsonData = resultsList.map(entry => ({
        "Term": entry.term,
        "isUnfair": entry.isUnfair,
        "Limitation of liability": entry.ltd,
        "Unilateral termination": entry.ter,
        "Unilateral change": entry.ch,
        "Content removal": entry.cr,
        "Contract by using": entry.use,
        "Choice of law": entry.law,
        "Jurisdiction": entry.j,
        "Arbitration": entry.a
    }));
    console.log(jsonData)

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "terms.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function main() {

    myModelExecution = new Worker("static/js/unfairTosDetection.js", { type: "module" });
    myModelExecution.onmessage = (e) => {
        resultsList = e.data.map(item => new Clause(
            item.term, item.ltd, item.ter, item.ch, item.cr, item.use, item.law, item.j, item.a
        ));
        resultsListFiltrada = [...resultsList];
        console.log(resultsList)
        printResults(resultsList);
        console.log("Message received from worker");
    };

    let sendTos = document.getElementById("form-send-tos");
    sendTos.onsubmit = handleAnalyseTerms;

    let download = document.getElementById("download-json");
    download.onclick = handleDownloadJSON;

    let radioButtons = document.querySelectorAll('input[type="radio"][name="inlineRadioOptions"]');
    radioButtons.forEach(function (radio) {
        radio.addEventListener('change', function (event) {
            let result = handleRadioChange(event, resultsList, resultsListFiltrada);
            resultsListFiltrada = [...result];
            printResults(result)
        });
    });

    let checkbox = document.getElementById('inlineCheckbox3');
    checkbox.addEventListener('change', function (event) {
        console.log(resultsList === resultsListFiltrada)
        let result = handleCheckboxChange(event, resultsList, resultsListFiltrada);
        resultsListFiltrada = [...result];
        printResults(result)
    });

    let range = document.getElementById('customRange2');
    range.addEventListener('input', function (event) {
        let result = handleRangeChange(event, resultsListFiltrada);
        printResults(result)
    });
}

document.addEventListener("DOMContentLoaded", main);