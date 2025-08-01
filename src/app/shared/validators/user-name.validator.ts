import { AbstractControl, ValidatorFn } from "@angular/forms";

export function userNameValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const userName = control.value;
    if (!userName) return null;
    
    const userNameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
    const valid = userNameRegex.test(userName);
    
    return valid ? null : { 'invalidUserName': { value: control.value } };
  };
}

