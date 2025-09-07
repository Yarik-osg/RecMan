
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
                    placeholder="Search task…"
                    aria-label="Search tasks"
                />
                <div className="filters">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => onFilter("all")}
                    >All</button>
                    <button
                        className={filter === "active" ? "active" : ""}
                        onClick={() => onFilter("active")}
                    >Active</button>
                    <button
                        className={filter === "completed" ? "active" : ""}
                        onClick={() => onFilter("completed")}
                    >Completed</button>
                </div>
            </div>

            <div className="right">
                <button onClick={onAddColumn}>+ Column</button>

                <div className="bulk" aria-label="Bulk actions">
                    <span className="muted">Selected: {selectedCount}</span>
                    <button disabled={!selectedCount} onClick={onCompleteSelected}>Mark ✓</button>
                    <button disabled={!selectedCount} onClick={onUncompleteSelected}>Unmark ✓</button>
                    <button disabled={!selectedCount} onClick={onDeleteSelected}>Delete</button>
                    <select
                        disabled={!selectedCount || columns.length === 0}
                        onChange={(e) => e.target.value && onMoveSelected(e.target.value)}
                        defaultValue=""
                        title="Move selected to column"
                    >
                        <option value="" disabled>Move to…</option>
                        {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
