export function handleRadioChange(event, resultsList, resultsListFiltrada) {
    console.log('Nuevo valor de radio: ', event.target.value);

    if (event.target.value === 'all') {
        if(document.getElementById('inlineCheckbox3').checked) {
            let filteredResults = [...resultsList];
            filteredResults.sort((a, b) => {
                const avgA = averageProbability(a);
                const avgB = averageProbability(b);
                return avgB - avgA; 
            });
            return filteredResults;
        } else {
            return resultsList;
        }
    } else {
        let filteredResults = resultsListFiltrada.filter(clause => clause.isUnfair);
        return filteredResults;
    }
}

function averageProbability(clause) {
    let total = 0;
    let count = 0;
    Object.keys(clause).forEach(key => {
        if (key !== "term") {
            total += clause[key];
            count++;
        }
    });
    return total / count;
}

export function handleCheckboxChange(event, resultsList, resultsListFiltrada) {
    console.log('Checkbox marcado: ', event.target.checked);
    if (event.target.checked) {

        resultsListFiltrada.sort((a, b) => {
            const avgA = averageProbability(a);
            const avgB = averageProbability(b);
            return avgB - avgA; 
        });
        return resultsListFiltrada;

    } else {
        let unfairSelect = document.getElementById('inlineRadio2').checked;
        if (unfairSelect) {
            let filteredResults = resultsList.filter(clause => clause.isUnfair);
            return filteredResults;
        } else {
            console.log('Lista no ordenada:', resultsList);
            return resultsList;
        }
    }
}

export function handleRangeChange(event, resultsListFiltrada) {
    let result = [];
    let valor = event.target.value;

    resultsListFiltrada.forEach(clausula => {
        if (parseInt((clausula.ltd * 100).toFixed(0)) >= valor ||
            parseInt((clausula.ter * 100).toFixed(0)) >= valor || 
            parseInt((clausula.ch * 100).toFixed(0)) >= valor ||
            parseInt((clausula.cr * 100).toFixed(0)) >= valor || 
            parseInt((clausula.use * 100).toFixed(0)) >= valor || 
            parseInt((clausula.law * 100).toFixed(0)) >= valor ||
            parseInt((clausula.j * 100).toFixed(0)) >= valor || 
            parseInt((clausula.a * 100).toFixed(0)) >= valor) {
            result.push(clausula);
        }
    });
    return result
}