export type TaskId = string;
export type ColumnId = string;

export interface Task {
    id: TaskId;
    title: string;
    completed: boolean;
}

export interface Column {
    id: ColumnId;
    title: string;
    taskIds: TaskId[];
}

export interface BoardState {
    tasks: Record<TaskId, Task>;
    columns: Record<ColumnId, Column>;
    columnOrder: ColumnId[];
}
