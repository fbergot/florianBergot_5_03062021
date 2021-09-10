import { objError } from "../errors/err.js";
/**
 * Create data or get data from localstorage
 * @export
 * @static
 * @use objError obj
 * @class LocalStorage
 */
export default class LocalStorage {
    /**
     * Verif if one key exist in localStorage
     * @static
     * @use objError obj
     * @param {String} key
     * @throw
     * @returns {Boolean}
     * @memberof LocalStorage
     */
    static _verifIfItemExist(key) {
        if (typeof key !== 'string' || key === '') {
            throw Error(`${objError.type.generic}`);
        }
        if (window.localStorage.getItem(key)) return true;
        return false;        
    }

    /** 
     *
     *
     * @static
     * @param {String} key (ever string in localStorage)
     * @param {String} value (ever string in localStorage)
     * @throw
     * @returns {void}
     * @memberof LocalStorage
     */
    static _setItem(key, value) {
        if ((typeof key !== 'string' || key === '') || (typeof value !== 'string' || value === '')) {
            throw Error(`${objError.type.generic} or empty`);
        }
        window.localStorage.setItem(key, value);
    }

    /**
     * Get one item in localStorage
     * @static
     * @use objError obj
     * @param {String} key
     * @throw
     * @returns {null|String}
     * @memberof LocalStorage
     */
    static _getItem(key) {
        if (typeof key !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        return window.localStorage.getItem(key);
    }

    /**
     * Remove one item with his key
     * @static
     * @memberof LocalStorage
     */
    static _removeItem(key) {
        window.localStorage.removeItem(key);
    }
}