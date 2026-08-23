import express from "express";
import { analyzeText, analyzeClauses, warmUp } from "unfair-tos-detector-core";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "1mb" }));

let ready = false;

app.get("/health", (req, res) => {
    if (!ready) {
        return res.status(503).json({ status: "loading" });
    }
    res.status(200).json({ status: "ok" });
});

function toResponseShape(clause) {
    return {
        term: clause.term,
        isUnfair: clause.isUnfair,
        wordCount: clause.wordCount,
        ltd: clause.ltd,
        ter: clause.ter,
        ch: clause.ch,
        cr: clause.cr,
        use: clause.use,
        law: clause.law,
        j: clause.j,
        a: clause.a,
    };
}

function toAnalyzeResponse({ summary, clauses }) {
    return {
        summary,
        clauses: clauses.map(toResponseShape),
    };
}

app.post("/v1/analyze", async (req, res, next) => {
    try {
        const { text, clauses } = req.body ?? {};

        if (Array.isArray(clauses) && clauses.length > 0) {
            const result = await analyzeClauses(clauses);
            return res.json(toAnalyzeResponse(result));
        }

        if (typeof text === "string" && text.trim().length > 0) {
            const result = await analyzeText(text);
            return res.json(toAnalyzeResponse(result));
        }

        return res.status(400).json({
            error: "Provide either a non-empty 'text' string or a non-empty 'clauses' array.",
        });
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal error while analyzing terms." });
});

app.listen(PORT, async () => {
    console.log(`unfair-tos-detector-api listening on port ${PORT}`);
    console.log("Loading model...");
    await warmUp();
    ready = true;
    console.log("Model ready.");
});
