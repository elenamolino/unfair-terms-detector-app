import sbd from "sbd";
import { analyzeClauses as runInference, warmUp } from "./detector.js";
import { Clause } from "./clause.js";
import { countWords } from "./textStats.js";
import { countSections } from "./sections.js";

function buildSummary(clauses, totalWords, sectionCount) {
    return {
        totalClauses: clauses.length,
        unfairClauses: clauses.filter((c) => c.isUnfair).length,
        totalWords,
        sectionCount,
    };
}

export async function analyzeClauses(clauses) {
    const results = await runInference(clauses);
    const totalWords = results.reduce((sum, c) => sum + c.wordCount, 0);
    return {
        // No raw document text available here, so section headings can't be located.
        summary: buildSummary(results, totalWords, null),
        clauses: results,
    };
}

export async function analyzeText(text) {
    const clauseTexts = sbd.sentences(text, {});
    const results = await runInference(clauseTexts);
    return {
        summary: buildSummary(results, countWords(text), countSections(text)),
        clauses: results,
    };
}

export { warmUp, Clause, countWords, countSections };
