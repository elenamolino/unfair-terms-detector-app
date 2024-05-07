import { AutoModelForSequenceClassification, AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";

function sigmoid(arr) {
    return arr.map((x) => 1 / (1 + Math.exp(-x)));
}

onmessage = async (e) => {
    console.log("Message received from main script");
    let auto_tokenizer = await AutoTokenizer.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let model = await AutoModelForSequenceClassification.from_pretrained('marmolpen3/lexglue-unfair-tos-onnx', { quantized: false });
    let resultPerclause = [];
    let clauses = e.data;
    for (let clause in clauses){
        let input_ids = auto_tokenizer(clauses[clause], { padding: true, truncation: true });
        let outputs = await model(input_ids);
        let normResults = sigmoid(outputs.logits.data);
        resultPerclause.push([clauses[clause], normResults]);
    }
    console.log("Posting message back to main script");
    postMessage(resultPerclause);
};