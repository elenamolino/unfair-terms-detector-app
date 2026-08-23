// Matches top-level numbered headings at the start of a line, e.g. "1. Introduction",
// "6 Third party claims", "Section 3: Governing Law", "Article 4". Deliberately excludes
// sub-numbering like "6.1 ..." (no whitespace right after the digits there). The number is
// capped at 3 digits so things like a street address ("1455 3rd Street") don't false-positive
// as section 1455 -- real ToS documents don't have thousands of sections.
const SECTION_HEADING_PATTERN =
    /^\s*(?:\d{1,3}|Section\s+\d{1,3}|Article\s+\d{1,3}|Cl[aá]usula\s+\d{1,3}|Art[ií]culo\s+\d{1,3})[.):]?\s+\S/i;

export function countSections(text) {
    if (!text) return 0;
    const lines = text.split(/\r?\n/);
    return lines.reduce((count, line) => count + (SECTION_HEADING_PATTERN.test(line) ? 1 : 0), 0);
}
