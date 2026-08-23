export function countWords(text) {
    if (!text) return 0;
    const matches = text.trim().match(/\S+/g);
    return matches ? matches.length : 0;
}
