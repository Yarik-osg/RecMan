
interface Props {
    query: string;
    onQuery: (v: string) => void;
    filter: "all" | "completed" | "active";
    onFilter: (f: "all" | "completed" | "active") => void;
    onAddColumn: () => void;
    onDeleteSelected: () => void;
    onCompleteSelected: () => void;
    onUncompleteSelected: () => void;
    onMoveSelected: (columnId: string) => void;
    columns: { id: string; title: string }[];
    selectedCount: number;
}

export default function Toolbar({
                                    query, onQuery, filter, onFilter,
                                    onAddColumn, onDeleteSelected, onCompleteSelected, onUncompleteSelected,
                                    onMoveSelected, columns, selectedCount
                                }: Props) {
    return (
        <div className="toolbar">
            <div className="left">
                <input
                    value={query}
                    onChange={(e) => onQuery(e.target.value)}
                    placeholder="Пошук задачі…"
                    aria-label="Search tasks"
                />
                <div className="filters">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => onFilter("all")}
                    >Всі</button>
                    <button
                        className={filter === "active" ? "active" : ""}
                        onClick={() => onFilter("active")}
                    >Незавершені</button>
                    <button
                        className={filter === "completed" ? "active" : ""}
                        onClick={() => onFilter("completed")}
                    >Завершені</button>
                </div>
            </div>

            <div className="right">
                <button onClick={onAddColumn}>+ Колонка</button>

                <div className="bulk" aria-label="Bulk actions">
                    <span className="muted">Вибрано: {selectedCount}</span>
                    <button disabled={!selectedCount} onClick={onCompleteSelected}>Позначити ✓</button>
                    <button disabled={!selectedCount} onClick={onUncompleteSelected}>Зняти ✓</button>
                    <button disabled={!selectedCount} onClick={onDeleteSelected}>Видалити</button>
                    <select
                        disabled={!selectedCount || columns.length === 0}
                        onChange={(e) => e.target.value && onMoveSelected(e.target.value)}
                        defaultValue=""
                        title="Перемістити вибране до колонки"
                    >
                        <option value="" disabled>Перемістити в…</option>
                        {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
