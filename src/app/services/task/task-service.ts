import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, ErrorResponse, UserDto, ShiftTaskOrderRangeDto, TaskDto, UpdateTaskPositionDto, MoveTaskDto } from '../../core/models';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  shiftTaskOrder(ShiftTaskOrderRangeDto: ShiftTaskOrderRangeDto): Observable<ApiResponse<object> | ErrorResponse> {
    const url = `${this.apiUrl}/api/Task/shift-range`;

    return this.http.post<ApiResponse<object> | ErrorResponse>(url, { ...ShiftTaskOrderRangeDto }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("API Call failed for shifting task order.");
          const failedResponse: ErrorResponse = {
            succeeded: false,
            errors: error.error,
            message: error.message,
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }

  getTaskMembers(taskId: number): Observable<ApiResponse<UserDto[]> | ErrorResponse> {
    const url = `${this.apiUrl}/api/task/${taskId}/members`;

    return this.http.get<ApiResponse<UserDto[]> | ErrorResponse>(url, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("API Call failed for shifting task order.");
          const failedResponse: ErrorResponse = {
            succeeded: false,
            errors: error.error,
            message: error.error.message,
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }

  updateTask(taskDto: TaskDto): Observable<ApiResponse<object> | ErrorResponse> {

    const url = `${this.apiUrl}/api/Task/${taskDto.id}`

    return this.http.put<ApiResponse<object> | ErrorResponse>(url, { ...taskDto }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("API Call failed for shifting task order.");
          const failedResponse: ErrorResponse = {
            succeeded: false,
            errors: error.error,
            message: error.error.message,
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }

  updateTaskPositions(UpdateTaskPositionDto: UpdateTaskPositionDto): Observable<ApiResponse<object> | ErrorResponse> {
    const url = `${this.apiUrl}/api/Task/update-positions`;
    return this.http.patch<ApiResponse<object> | ErrorResponse>(url, { ...UpdateTaskPositionDto }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("API Call failed for updating task positions.");
          const failedResponse: ErrorResponse = {
            succeeded: false,
            errors: error.error,
            message: error.message,
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }

  moveTask(taskId: number, moveTaskDto: MoveTaskDto): Observable<ApiResponse<object> | ErrorResponse> {
    const url = `${this.apiUrl}/api/Task/move/${taskId}`;

    return this.http.post<ApiResponse<object> | ErrorResponse>(url, { ...moveTaskDto }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("API Call failed for moving task.");
          const failedResponse: ErrorResponse = {
            succeeded: false,
            errors: error.error,
            message: error.message,
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )

  }
  createTask(taskDto: TaskDto): Observable<ApiResponse<TaskDto> | ErrorResponse> {
    const url = `${this.apiUrl}/api/Task`;

    return this.http.post<ApiResponse<TaskDto> | ErrorResponse>(url, { ...taskDto }, { withCredentials: true })
      .pipe(
        tap(
          response => {
            if (!response.succeeded) {
              const failedResponse: ErrorResponse = {
                succeeded: false,
                errors: response.errors,
                message: response.message,
                statusCode: response.statusCode
              }
              return failedResponse;
            }
            return response;
          }
        ),
        catchError((err: HttpErrorResponse) => {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            errors: err.error,
            message: err.message,
            statusCode: err.status
          }
          return of(failedResponse);
        })
      )

  }
}
