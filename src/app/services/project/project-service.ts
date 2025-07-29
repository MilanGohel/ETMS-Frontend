import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDto } from '../../core/models/project/project.dto';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../../core/models';
import { Router } from '@angular/router';

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
}
