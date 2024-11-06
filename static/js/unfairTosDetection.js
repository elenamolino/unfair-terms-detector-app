import { AutoModelForSequenceClassification, AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";
import { Clause } from './model/clause.js';


function sigmoid(arr) {
    return arr.map((x) => 1 / (1 + Math.exp(-x)));
}

onmessage = async (e) => {
    console.log("Message received from main script");
    let auto_tokenizer = await AutoTokenizer.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let model = await AutoModelForSequenceClassification.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let resultPerclause = [];
    let clauses = e.data;
    for (let clause in clauses) {
        let input_ids = auto_tokenizer(clauses[clause], { padding: true, truncation: true });
        let outputs = await model(input_ids);
        let normResults = sigmoid(outputs.logits.data);
        let term = new Clause(
            clauses[clause],
            normResults[0], 
            normResults[1], 
            normResults[2], 
            normResults[3], 
            normResults[4], 
            normResults[5], 
            normResults[6],
            normResults[7])
        resultPerclause.push(term);
    }
    console.log("Posting message back to main script");
    postMessage(resultPerclause);
};