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
     * @param {String|{}} data
     * @param {String='toOBJ, toJSON'} vSwitch
     * @throw
     * @returns {{}|String|null}
     * @memberof Utils
     */
    static _workWithJSON(data, vSwitch) {
        if (((typeof data === "object" && !Array.isArray(data)) || typeof data === "string") && typeof vSwitch === 'string') {
            switch (vSwitch) {
                case "toJSON":
                    if (Array.isArray(data) || typeof data !== 'object') {
                        throw Error(`${objError.type.generic}`);
                    }
                    return JSON.stringify(data);
                case "toOBJ":
                    if (typeof data !== 'string') {
                        throw Error(`${objError.type.generic}`);
                    }
                    return JSON.parse(data);
                default:
                    throw Error(`${objError.utils.vSwitch}`);
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
     * @returns {String | null}
     * @memberof Utils
     */
    static _getInParamURL(paramsStr, key) {
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
     * @returns {{}}
     * @memberof Utils
     */
    static _buildContactBody(arrayInputs) {
        if (!Array.isArray(arrayInputs)) {
            throw Error(`${objError.type.generic}`);
        }
        const contactBody = {};
        let i = 0;
        /**
         * Build contactBody object from arrayInput
         * @param {Number} n
         */
        function recursLoop(n) {
            if (i <= arrayInputs.length) {
                if (!arrayInputs[n].id || !arrayInputs[n].value) {
                    throw Error(`${objError.utils.missProp}`);
                }
                contactBody[arrayInputs[n].id] = arrayInputs[n].value;
                recursLoop(i++);
            }           
        }
        recursLoop(i);
        return contactBody; 
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
        /** @var {Array<String>} productsId */
        const productsId = [];       
        for (let i = 0; i < productsBasket.length; i++) {
            if (!productsBasket[i].quantity || !productsBasket[i]._id) {
                throw Error(`${objError.utils.missProp}`);
            }
            for (let j = 0; j < productsBasket[i].quantity; j++) {
            productsId.push(productsBasket[i]._id);
            }
        }
        return productsId;
    }
}

