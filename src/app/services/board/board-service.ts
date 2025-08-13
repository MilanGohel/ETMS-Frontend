import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { ApiResponse, BoardDto, CreateBoardDto, ErrorResponse, MoveBoardDto, ProjectDto, TaskDto } from '../../core/models';
import { error } from 'console';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  isBoardDragDisabled = signal<boolean>(false);

  getBoardsByProjectId(projectId: number): Observable<ApiResponse<BoardDto[]> | ErrorResponse> {

    const url = `${this.apiUrl}/api/Board/by-project/${projectId}`;

    return this.http.get<ApiResponse<BoardDto[]> | ErrorResponse>(url, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("API Call failed for getting project by id.");

        const failedResponse: ErrorResponse = {
          succeeded: false,
          message: 'Could not load projects. Please try again later.',
          errors: [error.message],
          statusCode: error.status
        };

        return of(failedResponse);
      })
    )
  }

  createNewBoard(createNewBoard: BoardDto) {
    const url = `${this.apiUrl}/api/Board`;

    return this.http.post<ApiResponse<BoardDto> | ErrorResponse>(url, { ...createNewBoard }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error?.message,
            errors: [error.message],
            statusCode: error.status
          };
          return of(failedResponse);
        })
      )
  }

  moveBoard(boardId: number, moveBoardDto: MoveBoardDto) {
    const url = `${this.apiUrl}/api/Board/move/${boardId}`;

    return this.http.patch<ApiResponse<object>>(url, { ...moveBoardDto }, { withCredentials: true })
      .pipe(
        tap((response: ApiResponse<object>) => {
          if (!response.succeeded) {
            const failedResponse: ErrorResponse = {
              succeeded: false,
              message: 'Could not move board. Please try again later.',
              errors: response.errors,
              statusCode: response.statusCode
            };
            return of(failedResponse);
          }
          return of(response);
        }),
        catchError((error: HttpErrorResponse) => {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error?.message,
            errors: [error.message],
            statusCode: error.status
          };
          return of(failedResponse);
        })
      )
  }

  updateBoard(board: BoardDto) {
    const url = `${this.apiUrl}/api/Board/${board.id}`;

    return this.http.put<ApiResponse<object>>(url, { ...board }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error?.message,
            errors: [error.message],
            statusCode: error.status
          };
          return of(failedResponse);
        })
      )
  }

  createNewTaskOnBoard(taskDto: TaskDto) {
    const url = `${this.apiUrl}/api/Task`;
    return this.http.post<ApiResponse<TaskDto> | ErrorResponse>(url, { ...taskDto }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error?.message,
            errors: [error.message],
            statusCode: error.status
          };
          return of(failedResponse);
        })
      )
  }

}
