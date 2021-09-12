import { objError } from "../errors/err.js";

/**
 * Allow validate data from user form
 * @export
 * @singleton
 * @use objError obj
 * @class Validation
 */
export default class Validation {
    /**
     * @property {null|InstanceType<Validation>} instance
     */
    static instance = null;

    /**
     * Allow get unique instance of Validation (singleton)
     * @static
     * @return {InstanceType<Validation>}
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
      /** @property {Object<RegExp> for => 0:firstName, 1:LastName, 2: email, 3: address, 4: city} regexForVerifInput */
      this.regexForVerifInput = {
        0: new RegExp("^[a-z ,.'-,éàèôê]{2,20}$", "i"),
        1: new RegExp("^[a-z ,.'-,éàèôê]{2,20}$", "i"),
        2: new RegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "i"
        ),
        3: new RegExp("^[a-z,0-9 ,.'-,éàèôê]{5,50}$", "i"),
        4: new RegExp("^[a-z ,.'-,éàèôê]{2,30}$", "i"),
      };
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