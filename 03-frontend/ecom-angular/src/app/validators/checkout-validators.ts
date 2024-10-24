import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckoutValidators {
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {

        // Check if string only contains whitespace
        if((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return error object
            return {'notOnlyWhitespace': true};
        }
        else{
            // valid, return null
            return null;
        }
    }
}
