import { of, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserService } from "../../services/user/user-service";

export function userNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const userName = control.value;
    if (!userName) return null;

    const userNameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
    return userNameRegex.test(userName) ? null : { invalidUserName: true };
  };
}

export function userNameExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    debugger;
    if (!control.value || control.invalid) {
      return of(null);
    }
    return userService.checkUserNameExists(control.value).pipe(
      map(exists => (exists ? { userNameTaken: true } : null))
    );
  };
}
