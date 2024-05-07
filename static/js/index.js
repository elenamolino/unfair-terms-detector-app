
var myModelExecution;

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
    let btnTos = document.getElementById("tos-button");
    results.innerHTML = "";    
    alert.classList.remove("visually-hidden");
    alert.innerHTML = "";
    btnTos.innerHTML = "";
    let htmlLoading = `<p class='alert alert-danger'>
    Terms are being processed, this will take a few minutes, please be patient!</p>`;
    let htmlBtnLoading = `
    <button class="btn btn-primary" type="submit" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Analysing terms
    </button>
    `
    let alertLoading = parseHTML(htmlLoading);
    let btnLoading = parseHTML(htmlBtnLoading);
    alert.appendChild(alertLoading);
    btnTos.appendChild(btnLoading);
}

function printResults(resultsList){

    let alert = document.getElementById("empty-alert");
    let results = document.getElementById("results");
    let btnTos = document.getElementById("tos-button");

    for (let result in resultsList) {
        let clause = resultsList[result][0];
        let normResults = resultsList[result][1];
        let htmlClauses = `
        <div class="card mb-3 ${normResults.some(x => x > 0.5) ? "border-primary bg-color-card" : ""}">
            <div class="card-body">
                <p id="clause" class="card-text ${normResults.some(x => x > 0.5) ? "fw-bold" : ""}">${clause}</p>
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

        let card = parseHTML(htmlClauses);
        results.appendChild(card);
    }
    alert.classList.add("visually-hidden");
    results.classList.remove("visually-hidden");
    btnTos.innerHTML = "";
    let newHtmlBtnLoading = `<button class="btn btn-primary" type="submit">Analyse terms</button>`
    let newbtnLoading = parseHTML(newHtmlBtnLoading);
    btnTos.appendChild(newbtnLoading);
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

async function main() {

    let resultsList;
    myModelExecution = new Worker("static/js/unfairTosDetection.js", {type: "module"});
    myModelExecution.onmessage = (e) => {
        resultsList = e.data;
        printResults(resultsList);
        console.log("Message received from worker");
    };
    let sendTos = document.getElementById("form-send-tos");
    sendTos.onsubmit = handleAnalyseTerms;
}

document.addEventListener("DOMContentLoaded", main);