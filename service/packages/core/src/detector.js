import { AutoModelForSequenceClassification, AutoTokenizer } from "@xenova/transformers";
import { Clause } from "./clause.js";

const MODEL_ID = "marmolpen3/lexglue-unfair-tos-onnx";

let modelPromise = null;

function sigmoid(arr) {
    return arr.map((x) => 1 / (1 + Math.exp(-x)));
}

function loadModel() {
    if (!modelPromise) {
        modelPromise = Promise.all([
            AutoTokenizer.from_pretrained(MODEL_ID, { quantized: false }),
            AutoModelForSequenceClassification.from_pretrained(MODEL_ID, { quantized: false }),
        ]);
    }
    return modelPromise;
}

export async function warmUp() {
    await loadModel();
}

export async function analyzeClauses(clauses) {
    const [tokenizer, model] = await loadModel();
    const results = [];
    for (const clause of clauses) {
        const input_ids = tokenizer(clause, { padding: true, truncation: true });
        const outputs = await model(input_ids);
        const normResults = sigmoid(outputs.logits.data);
        results.push(new Clause(
            clause,
            normResults[0],
            normResults[1],
            normResults[2],
            normResults[3],
            normResults[4],
            normResults[5],
            normResults[6],
            normResults[7],
        ));
    }
    return results;
}
