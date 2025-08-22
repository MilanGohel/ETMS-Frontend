import { BoardDto } from "../../features/board/models/board.model";

export interface CurrentBoardsState {
    boards: BoardDto[] | [];
}

export const initialCurrentBoardState: CurrentBoardsState = {
    boards: []
}