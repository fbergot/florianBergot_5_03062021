/**
 *
 * class utils
 * @export
 * @class Utils
 */
export default class Utils {

    /**
     * Allows create JSON from Obj or Obj from JSON
     * @static
     * @param {String|Object} data
     * @param {String} vSwitch
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
                    throw Error("Invalid parameter 'vSwitch' (accepted: 'toJSON' or 'toOBJ)");
            }          
        }
        // if bad type of locals identifiants
        throw Error('Invalid type(s) of parameter(s)');
    }

    /**
     * Get value of URL param with her key
     * @static
     * @param {String} paramsStr (ex: q=test&name=flo)
     * @param {String} key
     * @returns {String}
     * @memberof Utils
     */
    static getInParamURL(paramsStr, key) {
        if (typeof paramsStr !== 'string' || typeof key !== 'string') {
            throw Error('Invalid type(s) of parameter(s)')
        }
        const searchParams = new URLSearchParams(paramsStr);
        return searchParams.get(key);       
    }

   
}