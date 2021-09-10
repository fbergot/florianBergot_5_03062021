import Validation from "./Validation.js";

/**
 * @use Validation class
 * @static
 * @export
 * @class Form
 */
export default class Form {
    /**
     * verif before submit form
     * @static
     * @param {Array<HTMLInputElement>} inputsArray
     * @returns
     * @memberof Form
     */
    static beforeSubmit(inputsArray) {
        let state;
        for (let i = 0; i < inputsArray.length; i++) {
            state = Validation._getInstance().verifInput(inputsArray[i].value, i, inputsArray);
            if (!state) return false;
        }
        return true;                   
    }
}