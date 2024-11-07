import { terms } from './data/data.js';
import { galleryRenderer } from './render/gallery.js';
import { handleRadioChange, handleCheckboxChange, handleSelectChange, handleRangeChange } from './utils/filter.js'


let urlParams = new URLSearchParams(window.location.search);
let termId = urlParams.get("termId");

var resultsList;
var resultsListFiltrada;


function addTooltip(){
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
    let results = document.getElementById("results");
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
    filterForm.classList.remove("visually-hidden");
    addTooltip()
}


async function loadToSById(){

        let container = document.getElementById("detail-tos");
        try{
            let list_terms = terms;
            let tos = list_terms.find(term => term.id === termId);
            resultsList = tos.clauses;
            resultsListFiltrada = tos.clauses;
            printResults(tos.clauses)
            let gallery = galleryRenderer.asDetails(tos);
            container.appendChild(gallery);
        } catch (err) {
            messageRenderer.showErrorMessage("Error while loading Terms of Services", err);
        }
    }


async function main() {
    if (termId === null) {
        console.log("Please, provide a valid agreement");
        return;
    }

    await loadToSById()

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

    let typeSelect = document.getElementById("unfair-type");
    typeSelect.addEventListener("change", function (event) {
        let result = handleSelectChange(event, resultsList, resultsListFiltrada);
        resultsListFiltrada = [...result]; 
        printResults(result); 
    });

    let range = document.getElementById('customRange2');
    range.addEventListener('input', function (event) {
        let result = handleRangeChange(event, resultsListFiltrada);
        printResults(result)
    });
}

document.addEventListener("DOMContentLoaded", main);