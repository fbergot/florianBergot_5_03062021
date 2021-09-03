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
     * @returns {Object|String}
     * @memberof Utils
     */
    static workWithJSON(data, vSwitch) {
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
    static getInParamURL(paramsStr, key) {
        if (typeof paramsStr !== 'string' || typeof key !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        const searchParams = new URLSearchParams(paramsStr);
        return searchParams.get(key);       
    }

   
}