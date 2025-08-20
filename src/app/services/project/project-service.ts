import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { error } from 'console';
import { AddUsersToProjectDto, ApiResponse, CreateProjectDto, ErrorResponse, ProjectDto } from '../../core/models';
import { debugPort } from 'process';
import { response } from 'express';


type ProjectApiResult = ApiResponse<ProjectDto> | ErrorResponse;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectList = null;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private formatDateToDateOnlyString(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getUserProjects(): Observable<ApiResponse<ProjectDto[]>> {
    const url = `${this.apiUrl}/api/project/users/current`;

    return this.http.get<ApiResponse<ProjectDto[]>>(url, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (!response.succeeded) {
          const failedResponse: ApiResponse<ProjectDto[]> = {
            succeeded: false,
            message: 'Could not load projects. Please try again later.',
            data: [],
            errors: [response.message],
            statusCode: 400,
          };
          return of(failedResponse);
        }

        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API call failed to get user projects:', error);

        const failedResponse: ApiResponse<ProjectDto[]> = {
          succeeded: false,
          message: 'Could not load projects. Please try again later.',
          data: [],
          errors: [error.message],
          statusCode: error.status
        };

        return of(failedResponse);
      })
    );
  }

  getProjectById(projectId: number): Observable<ProjectApiResult> {
    const url = `${this.apiUrl}/api/Project/${projectId}`;

    return this.http.get<ApiResponse<ProjectDto>>(url, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Api call failed to get the PRoject", error);
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

  createProject(project: ProjectDto): Observable<ProjectApiResult> {

    const dates = {
      startDate: this.formatDateToDateOnlyString(project.startDate.toString()),
      endDate: this.formatDateToDateOnlyString(project.endDate.toString())
    }

    const url = `${this.apiUrl}/api/Project`;
    return this.http.post<ProjectApiResult>(url,
      { ...project, ...dates },
      { withCredentials: true }
    )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Api call failed to Create Project", error);
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error.message,
            errors: [error.error],
            statusCode: error.status
          }

          return of(failedResponse);
        })
      )
  }

  updateProject(project: ProjectDto): Observable<ProjectApiResult> {
    const url = `${this.apiUrl}/api/Project/${project.id}`;
    const dates = {
      startDate: this.formatDateToDateOnlyString(project.startDate.toString()),
      endDate: this.formatDateToDateOnlyString(project.endDate.toString())
    }
    return this.http.put<ProjectApiResult>(url,
      { ...project, ...dates },
      { withCredentials: true }
    )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Api call failed to Create Project", error);
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error.message,
            errors: [error.error],
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }

  deleteProject(projectId: number): Observable<ApiResponse<object> | ErrorResponse> {
    const url = `${this.apiUrl}/api/Project/${projectId}`;

    return this.http.delete<ApiResponse<object> | ErrorResponse>(url, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Api call failed to Create Project", error);
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error.message,
            errors: [error.error],
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }

  addUserToProject(projectId: number, addUserToProject: AddUsersToProjectDto): Observable<ApiResponse<object> | ErrorResponse> {
    const url = `${this.apiUrl}/api/Project/${projectId}/users`;

    return this.http.post<ApiResponse<object> | ErrorResponse>(url, { ...addUserToProject }, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Api call failed to Create Project", error);
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.error.message,
            errors: [error.error],
            statusCode: error.status
          }
          return of(failedResponse);
        })
      )
  }
}
