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
     * @throw
     * @return {Boolean}
     * @memberof Form
     */
    static _beforeSubmit(inputsArray) {
        if (!Array.isArray(inputsArray) || inputsArray.length === 0) {
            throw Error(`${objError.type.generic} or array is empty`);
        }
        for (let i = 0; i < inputsArray.length; i++) {
            if (!Validation._getInstance().verifInput(inputsArray[i].value, i, inputsArray)) {
                return false;
            } 
        }
        return true;                   
    }
}