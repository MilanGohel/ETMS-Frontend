import { createFeatureSelector, createSelector, select } from "@ngrx/store";
import { CurrentBoardsState } from "./current-boards.state";

export const selectCurrentBoardsState = createFeatureSelector<CurrentBoardsState>('currentBoards');
export const selectCurrentBoards = createSelector(
    selectCurrentBoardsState,
    state => state.boards
)
export const selectBoardById = (boardId: number) =>
    createSelector(
        selectCurrentBoardsState,
        (state: CurrentBoardsState) => state.boards.find(b => b.id === boardId)
    );
