import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { ApiResponse, BoardDto, ErrorResponse, ProjectDto } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

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
}
