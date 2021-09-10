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

    /**
     *Creates an instance of Validation.
     * @memberof Validation
     */
    constructor() {
        /** @var {Object<RegExp> for => 0:firstName, 1:LastName, 2: email, 3: address, 4: city} */
        this.regexForVerifInput = {
            0: new RegExp("^[a-z ,.'-]{2,20}$", 'i'),
            1: new RegExp("^[a-z ,.'-]{2,20}$", 'i'),
            2: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'i'),
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
     * @throw
     * @returns {Boolean}
     * @memberof Validation
     */
    verifInput(data, index, arrayInput) {
        if (typeof data !== "string" || typeof index !== 'number' || !Array.isArray(arrayInput)) {
            throw Error(`${objError.type.generic}`);
        }
        // test data with good RegExp
        if (this.regexForVerifInput[`${index}`].test(data)) {
            arrayInput[index].classList.remove('is-invalid');
            return true;
        }
        arrayInput[index].classList.add('is-invalid');
        return false;

    }
}