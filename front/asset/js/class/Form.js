import Validation from "./Validation.js";
import { objError } from "../errors/err.js";
/**
 * @use Validation class
 * @use objError obj
 * @static
 * @export
 * @class Form
 */
export default class Form {
    /**
     * verif before submit form
     * @static
     * @use Validation class
     * @use objError obj
     * @param {Array<HTMLInputElement>} inputsArray
     * @returns
     * @memberof Form
     */
    static beforeSubmit(inputsArray) {
        if (!Array.isArray(inputsArray)) {
            throw Error(`${objError.type.generic}`);
        }
        let state;
        for (let i = 0; i < inputsArray.length; i++) {
            if (!Validation._getInstance().verifInput(inputsArray[i].value, i, inputsArray)) {
                return false;
            } 
        }
        return true;                   
    }
}