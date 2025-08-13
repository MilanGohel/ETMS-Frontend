import { BoardDto } from "../../core/models";

export interface CurrentBoardsState {
    boards: BoardDto[] | [];
}

export const initialCurrentBoardState: CurrentBoardsState = {
    boards: []
}