import React, { useEffect, useMemo, useState } from "react";
import type {BoardState, Column, ColumnId, Task, TaskId} from "./types";
import { load, save } from "./storage";
import { uid } from "./utils";
import ColumnView from "./components/Column";
import ToolbarComp from "./components/Toolbar";

export default function App() {
    const [board, setBoard] = useState<BoardState>(() =>
        load<BoardState>(seedBoard())
    );
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
    const [selected, setSelected] = useState<Set<TaskId>>(new Set());
    const [draggingColumnId, setDraggingColumnId] = useState<ColumnId | null>(null);

    useEffect(() => save(board), [board]);

    const columnsPreview = useMemo(
        () => board.columnOrder.map((id) => board.columns[id]).filter(Boolean) as Column[],
        [board]
    );

    // ===== Task ops
    function addTask(columnId: ColumnId, title: string) {
        const id = uid("task");
        const newTask: Task = { id, title, completed: false };
        setBoard((b) => ({
            ...b,
            tasks: { ...b.tasks, [id]: newTask },
            columns: {
                ...b.columns,
                [columnId]: {
                    ...b.columns[columnId],
                    taskIds: [...b.columns[columnId].taskIds, id],
                },
            },
        }));
    }

    function deleteTask(id: TaskId) {
        setBoard((b) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...restTasks } = b.tasks;
            const columns = Object.fromEntries(
                Object.entries(b.columns).map(([cid, col]) => [
                    cid,
                    { ...col, taskIds: col.taskIds.filter((tid) => tid !== id) },
                ])
            );
            const next = { ...b, tasks: restTasks, columns };
            setSelected((s) => {
                s.delete(id);
                return new Set(s);
            });
            return next;
        });
    }

    function toggleTask(id: TaskId) {
        setBoard((b) => ({
            ...b,
            tasks: {
                ...b.tasks,
                [id]: { ...b.tasks[id], completed: !b.tasks[id].completed },
            },
        }));
    }

    function renameTask(id: TaskId, title: string) {
        setBoard((b) => ({
            ...b,
            tasks: { ...b.tasks, [id]: { ...b.tasks[id], title } },
        }));
    }

    // Move task to another column (append to end or at index)
    function dropTask(taskId: string, toColumnId: string, toIndex?: number) {
        setBoard(prev => {
            const newBoard = { ...prev };
            let fromColumnId = "";
            for (const colId in newBoard.columns) {
                if (newBoard.columns[colId].taskIds.includes(taskId)) {
                    fromColumnId = colId;
                    break;
                }
            }
            if (!fromColumnId) return prev;

            // delete from current column
            const fromTaskIds = [...newBoard.columns[fromColumnId].taskIds];
            const oldIndex = fromTaskIds.indexOf(taskId);
            if (oldIndex > -1) fromTaskIds.splice(oldIndex, 1);
            newBoard.columns[fromColumnId].taskIds = fromTaskIds;

            // move to another column
            const toTaskIds = [...newBoard.columns[toColumnId].taskIds];
            if (toIndex === undefined || toIndex < 0 || toIndex > toTaskIds.length) {
                toTaskIds.push(taskId);
            } else {
                toTaskIds.splice(toIndex, 0, taskId);
            }
            newBoard.columns[toColumnId].taskIds = toTaskIds;

            return newBoard;
        });
    }



    // ===== Column ops
    function addColumn() {
        const id = uid("col");
        const title = `Колонка ${board.columnOrder.length + 1}`;
        setBoard((b) => ({
            ...b,
            columns: { ...b.columns, [id]: { id, title, taskIds: [] } },
            columnOrder: [...b.columnOrder, id],
        }));
    }

    function deleteColumn(id: ColumnId) {
        setBoard((b) => {
            const col = b.columns[id];
            // delete tasks in column
            const tasks = { ...b.tasks };
            col.taskIds.forEach((t) => delete tasks[t]);
            // remove column
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...restCols } = b.columns;
            return {
                tasks,
                columns: restCols,
                columnOrder: b.columnOrder.filter((x) => x !== id),
            };
        });
    }

    function renameColumn(id: ColumnId, title: string) {
        setBoard((b) => ({
            ...b,
            columns: { ...b.columns, [id]: { ...b.columns[id], title } },
        }));
    }

    // Drag & drop columns
    function onDragStartColumn(e: React.DragEvent, id: ColumnId) {
        const target = e.target as HTMLElement;
        if (target.closest('.task')) return;
        setDraggingColumnId(id);
    }

    function onDragOverColumn(overId: ColumnId) {
        setBoard((b) => {
            const dragging = draggingColumnId;
            if (!dragging || dragging === overId) return b;
            const order = [...b.columnOrder];
            const from = order.indexOf(dragging);
            const to = order.indexOf(overId);
            if (from === -1 || to === -1) return b;
            order.splice(from, 1);
            order.splice(to, 0, dragging);
            return { ...b, columnOrder: order };
        });
    }
    function onDragEndColumn() {
        setDraggingColumnId(null);
    }

    // ===== Selection + bulk
    function setChecked(id: TaskId, v: boolean) {
        setSelected((s) => {
            const next = new Set(s);
            if (v) next.add(id); else next.delete(id);
            return next;
        });
    }
    function selectAll(columnId: ColumnId, v: boolean) {
        setSelected((s) => {
            const next = new Set(s);
            const ids = board.columns[columnId].taskIds;
            ids.forEach((id) => v ? next.add(id) : next.delete(id));
            return next;
        });
    }

    function bulkDelete() {
        const list = Array.from(selected);
        list.forEach(deleteTask);
    }
    function bulkComplete(v: boolean) {
        setBoard((b) => {
            const next = { ...b, tasks: { ...b.tasks } };
            selected.forEach((id) => {
                const t = next.tasks[id];
                if (t) next.tasks[id] = { ...t, completed: v };
            });
            return next;
        });
    }
    function bulkMove(toColumnId: ColumnId) {
        const ids = Array.from(selected);
        setBoard((b) => {
            const columns = { ...b.columns };
            // remove from any column
            Object.values(columns).forEach((c) => {
                c.taskIds = c.taskIds.filter((id) => !ids.includes(id));
            });
            // append to target
            columns[toColumnId].taskIds = [...columns[toColumnId].taskIds, ...ids];
            return { ...b, columns };
        });
    }


    const selectedCount = selected.size;

    return (
        <div className="app">
            <header>
                <h1>RecMan • Todo Board</h1>
            </header>

            <div className="toolbar-wrapper">
                <ToolbarComp
                    query={query}
                    onQuery={setQuery}
                    filter={filter}
                    onFilter={setFilter}
                    onAddColumn={addColumn}
                    onDeleteSelected={bulkDelete}
                    onCompleteSelected={() => bulkComplete(true)}
                    onUncompleteSelected={() => bulkComplete(false)}
                    onMoveSelected={bulkMove}
                    columns={columnsPreview.map(c => ({ id: c.id, title: c.title }))}
                    selectedCount={selectedCount}
                />
            </div>

            <main className="board" onDragOver={(e) => e.preventDefault()}>
                {board.columnOrder.map((id) => {
                    const col = board.columns[id];
                    if (!col) return null;
                    return (
                        <ColumnView
                            key={id}
                            column={col}
                            tasks={board.tasks}
                            selected={selected}
                            searchQuery={query}
                            filter={filter}
                            onAddTask={addTask}
                            onDeleteTask={deleteTask}
                            onToggleTask={toggleTask}
                            onRenameTask={renameTask}
                            onCheck={setChecked}
                            onSelectAll={selectAll}
                            onDeleteColumn={deleteColumn}
                            onRenameColumn={renameColumn}
                            onDropTask={dropTask}
                            onDragStartColumn={onDragStartColumn}
                            onDragOverColumn={onDragOverColumn}
                            onDragEndColumn={onDragEndColumn}
                            draggingColumnId={draggingColumnId}
                        />
                    );
                })}
                {board.columnOrder.length === 0 && (
                    <div className="empty">
                        <p>Немає колонок. Додай першу 👇</p>
                        <button onClick={addColumn}>+ Створити колонку</button>
                    </div>
                )}
            </main>

            <footer>
                <small>Зберігається в LocalStorage • Double-click для редагування назв</small>
            </footer>
        </div>
    );
}


// inital data
function seedBoard(): BoardState {
    const col1 = uid("col");
    const col2 = uid("col");
    const t1 = uid("task");
    const t2 = uid("task");
    const t3 = uid("task");
    const tasks: Record<string, Task> = {
        [t1]: { id: t1, title: "Підготувати тестове завдання", completed: false },
        [t2]: { id: t2, title: "Перевірити drag&drop між колонками", completed: false },
        [t3]: { id: t3, title: "Написати документацію", completed: true },
    };
    const columns: Record<string, Column> = {
        [col1]: { id: col1, title: "To Do", taskIds: [t1, t2] },
        [col2]: { id: col2, title: "Done", taskIds: [t3] },
    };
    return { tasks, columns, columnOrder: [col1, col2] };
}
