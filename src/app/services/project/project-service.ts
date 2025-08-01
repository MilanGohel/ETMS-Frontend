import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { error } from 'console';
import { ApiResponse, CreateProjectDto, ErrorResponse, ProjectDto } from '../../core/models';


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

  getUserProjects(): Observable<ApiResponse<ProjectDto[]>> {
    const url = `${this.apiUrl}/api/project/users/current`;

    return this.http.get<ApiResponse<ProjectDto[]>>(url, {
      withCredentials: true
    }).pipe(
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

  createProject(project: CreateProjectDto): Observable<ProjectApiResult> {
    const url = `${this.apiUrl}/api/Project`;
    debugger;
    return this.http.post<ProjectApiResult>(url,
      { ...project },
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
}
