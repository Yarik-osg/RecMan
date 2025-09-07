import React, { useEffect, useRef, useState } from "react";
import type {Task} from "../types";
import { highlight, normalizeWhitespace } from "../utils";

interface Props {
    task: Task;
    checked: boolean;
    onCheck: (id: string, v: boolean) => void;
    onToggle: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    searchQuery: string;
    draggableProps: {
        draggable: boolean;
        onDragStart: (e: React.DragEvent) => void;
        onDragEnd: (e: React.DragEvent) => void;
    };
    onDragOverTask: (id: string) => void;
}

export default function TaskItem({
                                     task, checked, onCheck, onToggle, onRename, onDelete, searchQuery,
                                     draggableProps, onDragOverTask
                                 }: Props) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.select();
    }, [editing]);

    return (
        <div
            className={`task ${task.completed ? "done" : ""}`}
            draggable={draggableProps.draggable}
            onDragStart={draggableProps.onDragStart}
            onDragEnd={draggableProps.onDragEnd}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOverTask(task.id);
            }}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheck(task.id, e.target.checked)}
            />
            <button className="tick" onClick={() => onToggle(task.id)}>
                {task.completed ? "✓" : "○"}
            </button>

            {!editing ? (
                <div
                    className="title"
                    onDoubleClick={() => setEditing(true)}
                    dangerouslySetInnerHTML={{ __html: highlight(task.title, searchQuery) }}
                />
            ) : (
                <input
                    ref={inputRef}
                    defaultValue={task.title}
                    onBlur={(e) => {
                        const v = normalizeWhitespace(e.target.value);
                        if (v && v !== task.title) onRename(task.id, v);
                        setEditing(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setEditing(false);
                    }}
                />
            )}

            <button className="delete" onClick={() => onDelete(task.id)}>✕</button>
        </div>
    );
}
