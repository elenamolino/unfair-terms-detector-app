// Matches top-level numbered headings at the start of a line, e.g. "1. Introduction",
// "6 Third party claims", "Section 3: Governing Law", "Article 4". Deliberately excludes
// sub-numbering like "6.1 ..." (no whitespace right after the digits there).
const SECTION_HEADING_PATTERN =
    /^\s*(?:\d+|Section\s+\d+|Article\s+\d+|Cl[aá]usula\s+\d+|Art[ií]culo\s+\d+)[.):]?\s+\S/i;

export function countSections(text) {
    if (!text) return 0;
    const lines = text.split(/\r?\n/);
    return lines.reduce((count, line) => count + (SECTION_HEADING_PATTERN.test(line) ? 1 : 0), 0);
}
