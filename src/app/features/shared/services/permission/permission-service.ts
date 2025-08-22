import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Permission } from '../../models/permission.model';
import { ApiResponse } from '../../models/api-response.model';
import { Role } from '../../models/role.model';
import { UpdateRolePermissionsDto } from '../../../../core/models';


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
    return this.http.get<ApiResponse<Permission[]>>(`${this.baseUrl}/role/${roleId}/permissions`);
  }

  assignPermissionToRole(roleId: number, permissionId: number): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(`${this.baseUrl}/role/${roleId}/permissions/${permissionId}`, {});
  }

  revokePermissionFromRole(roleId: number, permissionId: number): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.baseUrl}/role/${roleId}/permissions/${permissionId}`);
  }

  updateRolePermissions(updateRolePermissionDto: UpdateRolePermissionsDto): Observable<ApiResponse<object>>{
    return this.http.post<ApiResponse<object>>(`${this.baseUrl}/Role/${updateRolePermissionDto.roleId}/permissions/update`, {...updateRolePermissionDto});
  }
}