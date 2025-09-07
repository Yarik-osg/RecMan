const KEY = "recman.todo.board.v1";

export function save<T>(data: T) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function load<T>(fallback: T): T {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}
