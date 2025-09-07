export function uid(prefix = "id"): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeWhitespace(s: string) {
    return s.trim().replace(/\s+/g, " ");
}

export function highlight(text: string, query: string) {
    if (!query) return text;
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${esc})`, "ig"), "<mark>$1</mark>");
}
