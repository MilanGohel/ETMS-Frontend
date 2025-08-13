import { createReducer, on } from "@ngrx/store";
import { initialCurrentBoardState } from "./current-boards.state";
import { addNewBoard, addTaskToBoard, removeBoard, resetBoards, setCurrentBoards, updateBoard } from "./current-boards.actions";

export const currentBoardsReducer = createReducer(
    initialCurrentBoardState,
    on(setCurrentBoards, (state, { boards }) => ({
        ...state,
        boards: [...boards]
    })),
    on(resetBoards, () => ({ boards: [] })),
    on(addNewBoard, (state, { newBoard }) => ({
        ...state,
        boards: [...state.boards, newBoard]
    })),
    on(updateBoard, (state, { updatedBoard }) => ({
        ...state,
        boards: state.boards.map(b => b.id === updatedBoard.id ? updatedBoard : b)
    })),
    on(removeBoard, (state, { board }) => ({
        ...state,
        boards: state.boards.filter(b => b.id !== board.id)
    })),
    on(addTaskToBoard, (state, { boardId, task }) => ({
        ...state,
        boards: state.boards.map(
            b => b.id === boardId
                ? { ...b, tasks: [...b.tasks, task] }
                : b)
    }))
)

