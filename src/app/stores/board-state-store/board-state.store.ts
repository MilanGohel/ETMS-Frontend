// src/app/store/board-state.store.ts
import { computed, inject, Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TaskService } from '../../services/task/task-service';
import { BoardService } from '../../services/board/board-service';
import { ToastService } from '../../services/toast/toast.service';
import { BoardDto, MoveBoardDto, MoveTaskDto, StatusEnum, TaskDto } from '../../core/models';
import { HttpErrorResponse } from '@angular/common/http';


// 1. Define the shape of our state
export interface BoardState {
    boards: BoardDto[];
    editingTask: TaskDto | null;
    isLoading: boolean;
    isFindMemberModalOpen: boolean;
}

// 2. Define the initial state
const initialState: BoardState = {
    boards: [],
    editingTask: null,
    isLoading: false,
    isFindMemberModalOpen: false,
};

@Injectable({ providedIn: 'root' })

export class BoardStateStore extends signalStore(
    // Provide the initial state
    withState(initialState),

    //  Define computed signals (selectors)
    withComputed((store) => ({
        
        /**
         * A list of drop-list container IDs for cdkDrag.
         */
        connectedBoardIds: computed(() => store.boards().map(board => `board-${board.id}`)),
        /**
         * A boolean flag indicating if the task edit modal should be visible.
         */
        isTaskEditModalVisible: computed(() => !!store.editingTask()),
    })),

    // 5. Define methods to update state or trigger side-effects
    withMethods((store) => {
        // Inject dependencies required by the methods
        const boardService = inject(BoardService);
        const taskService = inject(TaskService);
        const toastService = inject(ToastService);

        return {
            // --- Synchronous State Updaters ---

            /**
             * Selects a task for editing or clears the selection.
             */
            selectTaskForEditing(task: TaskDto | null): void {
                patchState(store, { editingTask: task });
            },

            // --- Asynchronous Methods (Effects) ---

            /**
             * Loads all boards for a given project.
             * Uses `rxMethod` for handling the asynchronous operation declaratively.
             */
            loadBoards: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((projectId) =>
                        boardService.getBoardsByProjectId(projectId).pipe(
                            tap({
                                next: (res) => {
                                    if (res.succeeded) {
                                        patchState(store, { boards: res.data, isLoading: false });
                                    } else {
                                        patchState(store, { isLoading: false });
                                        toastService.error('Error', 'Failed to load boards.');
                                    }
                                },
                                error: () => {
                                    patchState(store, { isLoading: false });
                                    toastService.error('Error', 'Failed to load boards.');
                                },
                            })
                        )
                    )
                )
            ),

            /**
             * Creates a new task and optimistically adds it to the board.
             */
            createTask: rxMethod<{ boardId: number; taskName: string; isAddedAtEnd: boolean, projectId: number }>(
                pipe(
                    switchMap(({ boardId, taskName, isAddedAtEnd, projectId }) => {
                        const newTaskRequest: TaskDto = {
                            name: taskName,
                            boardId: boardId,
                            statusId: StatusEnum.Pending,
                            projectId: projectId,
                            isAddedAtEndOfBoard: isAddedAtEnd,
                        };

                        return taskService.createTask(newTaskRequest).pipe(
                            tap({
                                next: (response) => {
                                    if (!response.succeeded) {
                                        toastService.error('Error', response.message);
                                        return;
                                    }
                                    // On success, update the state immutably using a state updater function
                                    const createdTask = response.data;
                                    patchState(store, (currentState) => {
                                        const newBoards = currentState.boards.map(board => {
                                            if (board.id === boardId) {
                                                const tasks = board.tasks ? [...board.tasks] : [];
                                                isAddedAtEnd ? tasks.push(createdTask) : tasks.unshift(createdTask);
                                                return { ...board, tasks };
                                            }
                                            return board;
                                        });
                                        return { boards: newBoards };
                                    });
                                },
                                error: (err) => toastService.error('Error', err.message),
                            })
                        );
                    })
                )
            ),
            updateBoard: rxMethod<BoardDto>(
                pipe(
                    tap(
                        board =>
                            patchState(store, (currentState) => ({
                                boards: currentState.boards.map(b => b.id === board.id ? board : b)
                            })),
                    ),
                    switchMap(board =>
                        boardService.updateBoard(board).pipe(
                            tap({
                                next: () => console.log("Board Updated successfully!"),
                                error: (err: HttpErrorResponse) => {
                                    toastService.error('Update Failed', err.message);
                                    // Revert the optimistic update by re-fetching from the server.
                                }
                            })
                        )
                    )
                )
            ),

            // Get Editing Task Members
            getEditingTaskMembers: rxMethod<{ taskId: number }>(
                pipe(
                    switchMap(({ taskId }) => {
                        return taskService.getTaskMembers(taskId).pipe(
                            tap(
                                {
                                    next: (response) => {
                                        if (!response.succeeded) {
                                            toastService.error("Error", response.message);
                                            return;
                                        }

                                        patchState(store, (currentState) => {
                                            if (!currentState.editingTask) {
                                                return {}; 
                                            }

                                            return {
                                                editingTask: {
                                                    ...currentState.editingTask,
                                                    taskMembers: response.data
                                                }
                                            };
                                        });

                                    }
                                }
                            )
                        )
                    })
                )
            ),


            // --- Optimistic Update Methods ---


            /**
             * Handles moving a task within or between boards with optimistic UI updates.
             */
            moveTask(event: CdkDragDrop<TaskDto[]>): void {
                const movedTask = event.previousContainer.data[event.previousIndex];
                if (!movedTask?.id) return;

                // Keep a copy of the original boards array to revert on error
                const originalBoards = JSON.parse(JSON.stringify(store.boards()));

                // Optimistically update the UI
                if (event.previousContainer === event.container) {
                    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
                } else {
                    transferArrayItem(
                        event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex
                    );
                }

                // The CDK modifies the array in place, so we need to trigger a state update
                // with a new array reference to make Signals detect the change.
                patchState(store, { boards: [...store.boards()] });

                const newBoardId = Number(event.container.id.split('-')[1]);
                const newTaskArray = event.container.data;
                const previousTaskId = event.currentIndex > 0 ? newTaskArray[event.currentIndex - 1].id : undefined;
                const nextTaskId = event.currentIndex < newTaskArray.length - 1 ? newTaskArray[event.currentIndex + 1].id : undefined;
                const moveTaskDto: MoveTaskDto = { newBoardId, previousTaskId, nextTaskId };

                taskService.moveTask(movedTask.id, moveTaskDto).subscribe({
                    error: () => {
                        toastService.error('Error', 'Failed to move task.');
                        // Revert the optimistic update on failure
                        patchState(store, { boards: originalBoards });
                    },
                });
            },

            /**
             * Handles moving a board with optimistic UI updates.
             */
            moveBoard(previousIndex: number, currentIndex: number): void {
                const boardsArray = [...store.boards()];
                const movedBoard = boardsArray[previousIndex];
                if (!movedBoard?.id) return;

                // Optimistically update the UI
                moveItemInArray(boardsArray, previousIndex, currentIndex);
                patchState(store, { boards: boardsArray });

                const previousBoardId = currentIndex > 0 ? boardsArray[currentIndex - 1].id : undefined;
                const nextBoardId = currentIndex < boardsArray.length - 1 ? boardsArray[currentIndex + 1].id : undefined;
                const moveDto: MoveBoardDto = { previousBoardId, nextBoardId };

                boardService.moveBoard(movedBoard.id, moveDto).subscribe({
                    error: (err) => {
                        toastService.error('Error', err.message);
                        // Revert the change on error by moving the item back
                        moveItemInArray(boardsArray, currentIndex, previousIndex);
                        patchState(store, { boards: boardsArray });
                    },
                });
            },

            // Toggle Find Members modal
            toggleFindMembersModal(){
                patchState(store, (state) => ({
                    isFindMemberModalOpen: !state.isFindMemberModalOpen
                }))   
            }
            


        };
    })
) { }