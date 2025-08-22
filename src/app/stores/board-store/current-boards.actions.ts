import { createAction, props } from "@ngrx/store";
import { BoardDto } from "../../features/board/models/board.model";
import { TaskDto } from "../../features/task/models/task.model";

export const setCurrentBoards = createAction(
    '[CurrentBoards] Set',
    props<{ boards: BoardDto[] }>()
);


export const addNewBoard = createAction(
    '[CurrentBoards] Add',
    props<{ newBoard: BoardDto }>()
)

export const updateBoard = createAction(
    '[CurrentBoards] Update',
    props<{ updatedBoard: BoardDto }>()
)

export const removeBoard = createAction(
    '[CurrentBoards] Remove',
    props<{ board: BoardDto }>()
)

export const addTaskToBoard = createAction(
    '[CurrentBoards] AddTaskToBoard',
    props<{boardId: number, task: TaskDto}>()
);

export const resetBoards = createAction('[CurrentBoards] Reset');


