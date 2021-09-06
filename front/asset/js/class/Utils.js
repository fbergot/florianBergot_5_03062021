import { objError } from "../errors/err.js";
/**
 *
 * class utils
 * @export
 * @use objError
 * @class Utils
 */
export default class Utils {

    /**
     * Allows create JSON from Obj or Obj from JSON
     * @static
     * @use objError
     * @param {String|Object} data
     * @param {String} vSwitch
     * @throw
     * @returns {Object|String|null}
     * @memberof Utils
     */
    static _workWithJSON(data, vSwitch) {
        // verif type of locals identifiants
        if ((typeof data === "object" || typeof data === "string") && typeof vSwitch === 'string') {
            switch (vSwitch) {
                case "toJSON":
                    return JSON.stringify(data);
                case "toOBJ":
                    return JSON.parse(data);
                default:
                    throw Error(`${objError.utils}`);
            }          
        }
        // if bad type of locals identifiants
        throw Error(`${objError.type.generic}`);
    }

    /**
     * Get value of URL param with her key
     * @static
     * @use objError
     * @param {String} paramsStr (ex: q=test&name=flo)
     * @param {String} key
     * @throw
     * @returns {String}
     * @memberof Utils
     */
    static _getInParamURL(paramsStr, key) {
        // verif type of locals identifiants
        if (typeof paramsStr !== 'string' || typeof key !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        const searchParams = new URLSearchParams(paramsStr);
        return searchParams.get(key);       
    }

    /**
     * to divide 
     * @static
     * @use objError
     * @param {Number} price
     * @param {Number} nDiv
     * @returns {null|Number} 
     * @memberof Utils
     */
    static _divide(price, nDiv) {
        // verif type of locals identifiants
        if (typeof price !== 'number' || typeof nDiv !== 'number') {
            throw Error(`${objError.type.generic}`);
        }
        return (price === 0 ? null : nDiv === 0 ? null : price / nDiv);
    }
}

