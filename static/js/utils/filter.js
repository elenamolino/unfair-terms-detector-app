export function handleRadioChange(event, resultsList, resultsListFiltrada) {
    console.log('Nuevo valor de radio: ', event.target.value);

    if (event.target.value === 'all') {
        if (document.getElementById('inlineCheckbox3').checked) {
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

export function handleSelectChange(event, resultsList, resultsListFiltrada) {
    const selectedValue = event.target.value;
    const clauseDictionary = {
        1: "ltd",
        2: "ter",
        3: "ch",
        4: "cr",
        5: "use",
        6: "law",
        7: "j",
        8: "a"
    };
    if (selectedValue == 0) {
        return resultsList;
    } else {
        const clauseType = clauseDictionary[selectedValue];
        console.log(clauseType)
        const filteredList = resultsList.filter(clause => {
            return clause[clauseType] > 0.5;
        });
        return filteredList
    }

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
        console.log(unfairSelect)
        if (unfairSelect) {
            let filteredResults = resultsList.filter(clause => clause.isUnfair);
            return filteredResults;
        } else {
            console.log('Lista no ordenada:', resultsList);
            let filteredResults = [...resultsList];
            return filteredResults;
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