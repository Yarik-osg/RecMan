import React, { useRef, useState } from "react";
import type {Column, Task} from "../types";
import TaskItem from "./TaskItem";
import { normalizeWhitespace } from "../utils";

interface Props {
    column: Column;
    tasks: Record<string, Task>;
    selected: Set<string>;
    searchQuery: string;
    filter: "all" | "completed" | "active";
    onAddTask: (columnId: string, title: string) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleTask: (taskId: string) => void;
    onRenameTask: (taskId: string, title: string) => void;
    onCheck: (taskId: string, v: boolean) => void;
    onSelectAll: (columnId: string, v: boolean) => void;
    onDeleteColumn: (columnId: string) => void;
    onRenameColumn: (columnId: string, title: string) => void;
    onDropTask: (taskId: string, toColumnId: string, index?: number) => void;
    // DnD columns
    onDragStartColumn: (e: React.DragEvent, id: string) => void;
    onDragOverColumn: (overId: string) => void;
    onDragEndColumn: () => void;
    draggingColumnId?: string | null;
}

export default function ColumnView(props: Props) {
    const {
        column, tasks, selected, searchQuery, filter,
        onAddTask, onDeleteTask, onToggleTask, onRenameTask,
        onCheck, onSelectAll, onDeleteColumn, onRenameColumn, onDropTask,
        onDragStartColumn, onDragOverColumn, onDragEndColumn, draggingColumnId
    } = props;

    const [newTitle, setNewTitle] = useState("");
    const [editingTitle, setEditingTitle] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const visibleTaskIds = column.taskIds.filter(id => {
        const t = tasks[id];
        if (!t) return false;
        const byFilter =
            filter === "all" ? true :
                filter === "completed" ? t.completed :
                    !t.completed;
        const byQuery = !searchQuery
            || t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return byFilter && byQuery;
    });

    function handleTaskDrop(e: React.DragEvent) {
        const taskId = e.dataTransfer.getData("text/task");
        if (!taskId) return;

        const toIndex = dragOverIndex ?? column.taskIds.length;
        onDropTask(taskId, column.id, toIndex);
        setDragOverIndex(null);
    }

    return (
        <div
            className={`column ${draggingColumnId === column.id ? "dragging" : ""}`}
            ref={ref}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOverColumn(column.id);
            }}
            onDrop={(e) => {
                handleTaskDrop(e);
                setDragOverIndex(null);
            }}
            onDragLeave={(e) => {
                if (!ref.current?.contains(e.relatedTarget as Node)) {
                    setDragOverIndex(null);
                }
            }}
            draggable
            onDragStart={(e) => onDragStartColumn(e, column.id)}
            onDragEnd={() => {
                onDragEndColumn();
                setDragOverIndex(null);
            }}
        >
            <div className="column-header">
                {!editingTitle ? (
                    <>
                        <h3 onDoubleClick={() => setEditingTitle(true)}>{column.title}</h3>
                        <div className="actions">
                            <button onClick={() => onSelectAll(column.id, true)}>Select all</button>
                            <button onClick={() => onSelectAll(column.id, false)}>Clear</button>
                            <button className="danger" onClick={() => onDeleteColumn(column.id)}>Delete column</button>
                        </div>
                    </>
                ) : (
                    <input
                        defaultValue={column.title}
                        onBlur={(e) => {
                            const v = normalizeWhitespace(e.target.value);
                            if (v && v !== column.title) onRenameColumn(column.id, v);
                            setEditingTitle(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            if (e.key === "Escape") setEditingTitle(false);
                        }}
                    />
                )}
            </div>

            <div className="tasks">
                {visibleTaskIds.map((id, idx) => {
                    const t = tasks[id]!;

                    return (
                        <React.Fragment key={id}>
                            {/* drop indicator before task */}
                            {dragOverIndex === idx && <div className="drop-indicator" />}

                            <TaskItem
                                task={t}
                                checked={selected.has(id)}
                                onCheck={onCheck}
                                onToggle={onToggleTask}
                                onRename={onRenameTask}
                                onDelete={onDeleteTask}
                                searchQuery={searchQuery}
                                draggableProps={{
                                    draggable: true,
                                    onDragStart: (e) => {
                                        e.dataTransfer.setData("text/task", id);
                                        e.dataTransfer.effectAllowed = "move";
                                    },
                                    onDragEnd: () => {},
                                }}
                                onDragOverTask={() => setDragOverIndex(idx)}
                            />
                        </React.Fragment>
                    );
                })}

                {/* drop indicator at the end of the list */}
                {dragOverIndex === visibleTaskIds.length && <div className="drop-indicator" />}
            </div>


            <form
                className="add-task"
                onSubmit={(e) => {
                    e.preventDefault();
                    const v = normalizeWhitespace(newTitle);
                    if (!v) return;
                    onAddTask(column.id, v);
                    setNewTitle("");
                }}
            >
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New task…"
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
}
