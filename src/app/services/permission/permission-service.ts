import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ApiResponse, ErrorResponse, Permission, Role } from '../../core/models';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class PermissionService { 
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api`;

  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.baseUrl}/Role`);
  }

  getPermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(`${this.baseUrl}/Permission`);
  }

  getPermissionsForRole(roleId: number): Observable<ApiResponse<Permission[]>> {
    // NOTE: Using the endpoint we created in the .NET controller
    return this.http.get<ApiResponse<Permission[]>>(`${this.baseUrl}/Permission/roles/${roleId}/permissions`);
  }

  assignPermissionToRole(roleId: number, permissionId: number): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(`${this.baseUrl}/Permission/roles/${roleId}/permissions/${permissionId}`, {});
  }

  revokePermissionFromRole(roleId: number, permissionId: number): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.baseUrl}/Permission/roles/${roleId}/permissions/${permissionId}`);
  }
}