import { terms_summary } from './data/data.js';
import { galleryRenderer } from './render/gallery.js';


let urlParams = new URLSearchParams(window.location.search);
let termId = urlParams.get("termId");


async function loadToSById(){

        let container = document.getElementById("detail-tos");
        try{
            let list_terms = terms_summary;
            let tos = list_terms.find(term => term.id === termId)
            console.log(tos);
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

    console.log(termId)
}

document.addEventListener("DOMContentLoaded", main);