import { inject, Injectable } from '@angular/core';
import { ApiResponse, ErrorResponse, UserNameExistsDto } from '../../core/models';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  checkUserNameExists(userName: string): Observable<boolean> {
    const url = `${this.apiUrl}/api/User/exists?userName=${userName}`;
    const response =  this.http.get<ApiResponse<UserNameExistsDto>>(url).pipe(
      map(response => response.data.isUserNameExists), 
      catchError(() => of(false))
    );
    console.log(response);
    return response;
  }

}
