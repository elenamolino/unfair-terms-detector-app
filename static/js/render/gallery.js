"use strict";

function parseHTML(str) {
    let tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp.body.children[0];
}

const galleryRenderer = {
    asCardGallery: function (terms) {
        let galleryContainer = parseHTML('<div class="terms-gallery"></div>');
        let row = parseHTML('<div class="row"></div>');
        galleryContainer.appendChild(row);
        let counter = 0;
        for (let term of terms) {
            let card = galleryRenderer.asCard(term);
            row.appendChild(card);
            counter += 1;
            if (counter % 3 === 0) {
                row = parseHTML('<div class="row"></div>');
                galleryContainer.appendChild(row);
            }
        }
        return galleryContainer;
    },
    asCard: function (term) {
        let unfairTerms = term.clauses.filter(term => term.isUnfair).length;
        let unfairness = ((unfairTerms/term.clauses.length)*100).toFixed(0)
        let html = `
        <div class="col-md-4">
            <div class="card card-tam mb-3">
                <a href="term_detail.html?termId=${term.id}">    
                <img src="${term.icon}" class="card-img-top">   
                </a>         
                <div class="card-body">
                    <a href="${term.url}" target="_blank">  
                        <h5 class="card-title text-center">${term.title}</h5>
                    </a>
                    <p class="card-text">${term.date}</p>
                    <p>Total Terms <span class="badge text-bg-primary">${term.clauses.length}</span> - Unfair Terms <span class="badge text-bg-danger">${unfairTerms}</span></p>
                    <p>Percentage of unfairness: ${unfairness} %</p>
                    <p>Number of sections: ${term.num_sections}</p>
                    <p>Number of words: ${term.num_words}</p>
                </div>
            </div>
        </div>`;
        let card = parseHTML(html);
        return card;
    },
    asDetails: function (tos) {
        let unfairTerms = tos.clauses.filter(term => term.isUnfair).length;
        let html = `
        <div class="mb-3">
            <h2>${tos.title}</h2>
            <p class="card-text">${tos.date}</p>
            <p>Total Terms <span class="badge text-bg-primary">${tos.clauses.length}</span> - Unfair Terms <span class="badge text-bg-danger">${unfairTerms}</span></p>
        </div>`;
        let tosDetails = parseHTML(html);
        return tosDetails;
    }
};

export { galleryRenderer };