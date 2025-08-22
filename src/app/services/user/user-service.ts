import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../features/shared/models/api-response.model';
import { PaginatedList } from '../../features/shared/models/pagination.model';
import { UserDto } from '../../features/shared/models/user.model';
import { ErrorResponse } from '../../features/shared/models/error-response.model';
import { UserNameExistsDto } from '../../core/models';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  checkUserNameExists(userName: string): Observable<boolean> {
    const url = `${this.apiUrl}/api/User/exists?userName=${userName}`;
    const response = this.http.get<ApiResponse<UserNameExistsDto>>(url).pipe(
      map(response => response.data.isUserNameExists),
      catchError(() => of(false))
    );
    console.log(response);
    return response;
  }

  searchMembers(searchString: string): Observable<ApiResponse<PaginatedList<UserDto>> | ErrorResponse> {
    const url = `${this.apiUrl}/api/User/search/members?searchString=${searchString}`;

    return this.http
      .get<ApiResponse<PaginatedList<UserDto>> | ErrorResponse>(url)   
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: error.message,
            errors: error.error,
            statusCode: error.status
          };
          return of(failedResponse);
        })
      );
  }
}
