// validators/email.validator.ts
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const email = control.value;
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    
    return valid ? null : { 'invalidEmail': { value: control.value } };
  };
}

