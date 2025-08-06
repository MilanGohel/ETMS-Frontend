import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, ErrorResponse, TaskDto } from '../../core/models';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
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
