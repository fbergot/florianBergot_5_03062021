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
        if ((typeof data === "object" || typeof data === "string") && typeof vSwitch === 'string') {
            switch (vSwitch) {
                case "toJSON":
                    return JSON.stringify(data);
                case "toOBJ":
                    return JSON.parse(data);
                default:
                    throw Error("Invalid parameter 'vSwitch'");
            }          
        }
        // if bad type of locals identifiants
        throw Error('Invalid type(s) of parameter(s)');
    }

   
}