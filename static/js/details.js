import { terms_summary } from './data/data.js';
import { galleryRenderer } from './render/gallery.js';
import { handleRadioChange, handleCheckboxChange, handleRangeChange } from './utils/filter.js'


let urlParams = new URLSearchParams(window.location.search);
let termId = urlParams.get("termId");

var resultsList;
var resultsListFiltrada;


function buttonHTML(buttonName, value) {
    return `
    <button class="btn btn-sm btn-primary btn-unclick position-relative me-3 my-2 ${value < 0.5 ? "btn-opacity" : ""}">
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
                    ${buttonHTML('Limitation of liability', clause.ltd)}
                    ${buttonHTML('Unilateral termination', clause.ter)}
                    ${buttonHTML('Unilateral change', clause.ch)}
                    ${buttonHTML('Content removal', clause.cr)}
                    ${buttonHTML('Contract by using', clause.use)}
                    ${buttonHTML('Choice of law', clause.law)}
                    ${buttonHTML('Jurisdiction', clause.j)}
                    ${buttonHTML('Arbitration', clause.a)}
                </div>
            </div>`;
        });
    }
    results.innerHTML = htmlClauses;
    filterForm.classList.remove("visually-hidden");
}


async function loadToSById(){

        let container = document.getElementById("detail-tos");
        try{
            let list_terms = terms_summary;
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

    let range = document.getElementById('customRange2');
    range.addEventListener('input', function (event) {
        let result = handleRangeChange(event, resultsListFiltrada);
        printResults(result)
    });
}

document.addEventListener("DOMContentLoaded", main);