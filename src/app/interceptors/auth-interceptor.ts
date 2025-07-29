import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, switchMap, tap, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth-service";
export function authInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

    const authService = inject(AuthService);

    const allowedRoutes = ["/profile", "/login", "/signup"];

    const isAllowed = allowedRoutes.some(route => req.url.includes(route));

    let clonedReq = req;

    // Only set Bearer for NOT allowed (protected) routes
    if (!isAllowed) {
        const token = authService.getAccessToken();
        if (token) {
            clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }

    return next(clonedReq).pipe(
        tap(event => {
            if (event.type === HttpEventType.Response) {
                console.log(req.url, 'returned a response with status', event.status);
            }
        }),
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status == 401 && !isAllowed) {
                // Attempt refresh, then retry original request
                return authService.refreshToken().pipe(
                    switchMap(() => next(clonedReq)), // retry the original request
                    catchError((err) => {
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }
            return throwError(() => error);
        })
    );
}