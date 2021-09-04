import { objError } from "../errors/err.js";
/**
 * Create data or get data from localstorage
 * @export
 * @use objError obj
 * @class LocalStorage
 */
export default class LocalStorage {

    /**
     * Verif if a item exist in localStorage
     * @static
     * @use objError obj
     * @param {String} key
     * @returns {Boolean}
     * @memberof LocalStorage
     */
    static _verifIfItemExist(key) {
        if (typeof key !== 'string' || key === '') {
            throw Error(`${objError.type.generic}`);
        }
        if (window.localStorage.getItem(key)) {
            return true;
        }
        return false;        
    }

    /**
     *
     *
     * @static
     * @param {String} key
     * @param {String} value (ever string in locStorage)
     * @memberof LocalStorage
     */
    static _setItem(key, value) {
        if (typeof key !== 'string' || key === '' || typeof value !== 'string' || value === '') {
            throw Error(`${objError.type.generic}`);
        }
        window.localStorage.setItem(key, value);
    }
}