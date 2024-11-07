import { galleryRenderer } from './render/gallery.js';
import { terms } from './data/data.js';

function handleMouseEnter(event) {
    let card = event.target;
    card.style.border = "2px solid blue";
}

function handleMouseLeave(event) {
    let card = event.target;
    card.style.border = "1px solid grey";
}

async function loadAllToS(){

    let container = document.getElementById("gallery");
    try{
        let list_terms = terms;
        console.log(list_terms);
        let gallery = galleryRenderer.asCardGallery(list_terms);
        container.appendChild(gallery);
    } catch (err) {
        messageRenderer.showErrorMessage("Error while loading Terms of Services", err);
    }
}

async function main() {

    await loadAllToS()

    let cards = document.querySelectorAll("div.card");
    for (let card of cards) {
        card.onmouseenter = handleMouseEnter;
        card.onmouseleave = handleMouseLeave;
    }
}

document.addEventListener("DOMContentLoaded", main);