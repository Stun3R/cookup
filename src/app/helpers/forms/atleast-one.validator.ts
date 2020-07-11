import { FormGroup } from "@angular/forms";

// custom validator to check that two fields match
export function AtleastOne(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.atleastOne) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value.length === 0 && matchingControl.value.length === 0) {
      matchingControl.setErrors({ atleastOne: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
