import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function UserRoleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validRoles = ['customer', 'seller'];
    const role = control.value;

    if (!validRoles.includes(role)) {
      return { RoleInvalid: true };
    }
    return null;
  };
}
