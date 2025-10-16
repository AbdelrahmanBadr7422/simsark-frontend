import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PropertyTypeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validRoles = ['apartment', 'villa', 'studio', 'land'];
    const role = control.value;

    if (!validRoles.includes(role)) {
      return { propertyTypeInvalid: true };
    }
    return null;
  };
}
