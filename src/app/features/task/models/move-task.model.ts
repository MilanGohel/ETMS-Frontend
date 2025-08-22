export interface MoveTaskDto {
  newBoardId: number;
  previousTaskId?: number | null;
  nextTaskId?: number | null;
}