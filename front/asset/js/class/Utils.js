import { objError } from "../errors/err.js";
/**
 * class utils
 * @static 
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

    /**
     * Build an object from an array of HTMLInputElement
     * @use objError obj
     * @static
     * @param {Array<HTMLInputElement>} arrayInputs
     * @returns {Object<String>}
     * @memberof Utils
     */
    static _buildContactBody(arrayInputs) {
        if (!Array.isArray(arrayInputs)) {
            throw Error(`${objError.type.generic}`);
        }
        /**
         * Build postBody object from arrayInput
         * @param {Number} n
         */
        const postBody = {};
        let i = 0;
        function recursLoop(n) {
            if (i <= arrayInputs.length) {
                postBody[arrayInputs[n].id] = arrayInputs[n].value;
                recursLoop(i++);
            }           
        }
        recursLoop(i);
        return postBody; 
    }

    /**
     * Recompose id of product
     * @static
     * @param {Array} { productsBasket }
     * @returns {Array<String>} ids products
     * @memberof Utils
     */
    static _recomposeProductsId({ productsBasket }) {
        if (!Array.isArray(productsBasket)) {
            throw Error(`${objError.type.generic}`);
        }
        /** @var {Array<String>} */
        const productsId = [];       
        for (let i = 0; i < productsBasket.length; i++) {
            for (let j = 0; j < productsBasket[i].quantity; j++) {
                productsId.push(productsBasket[i]._id);
            }
        }
        return productsId;
    }
}

