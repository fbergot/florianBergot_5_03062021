import { objError } from "../errors/err.js";

/**
 * Allow validate data from user form
 * @export
 * @singleton
 * @class Validation
 */
export default class Validation {
    /**@var {null|Instance of Validation} */
    static instance = null;

    /**
     * Allow get unique instance of Validation (singleton)
     * @static
     * @returns {Instance of Validation}
     * @memberof Validation
     */
    static _getInstance() {
        if (this.instance === null) {
            this.instance = new Validation();
            return this.instance;
        }
        return this.instance;
    }

    constructor() {
        this.regexForVerifInput = {
            0: new RegExp("^[a-z ,.'-]{2,20}$", 'i'),
            1: new RegExp("^[a-z ,.'-]{2,20}$", 'i'),
            2: new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$", "gi"),
            3: new RegExp("^[a-z|0-9 ,.'-]{5,50}$", 'i'),
            4: new RegExp("^[a-z ,.'-]{2,30}$", 'i'),
        }
    }
        
    /**
     * Analyse user input
     * @use objError obj
     * @param {String} data
     * @param {Number} index
     * @param {Array<HTMLInputElement>} arrayInput
     * @memberof Validation
     */
    verifInput(data, index, arrayInput) {
        if (typeof data !== "string" || typeof index !== 'number' || !Array.isArray(arrayInput)) {
            throw Error(`${objError.type.generic}`);
        }
        if (this.regexForVerifInput[`${index}`].test(data)) {
            arrayInput[index].classList.remove('is-invalid');
        }
        else {
            arrayInput[index].classList.add('is-invalid');
        }
    }
}