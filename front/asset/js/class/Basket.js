import Utils from "./Utils.js";
import LocalStorage from "./LocalStorage.js";
import { objError } from "../errors/err.js";
/**
 * all for the basket
 * @export
 * @static
 * @use LocalStrorage class
 * @use Utils class
 * @use objError obj
 * @class Basket
 */
export default class Basket {
    static keyBasket = 'basket';
    static defBasket = { productsBasket: [] };
    /**
     * add product in basket
     * @static
     * @use LocalStorage class
     * @param {Object} product
     * @memberof Basket
     */
    static _addInBasket(product) {
        if (typeof product !== 'object') {
            throw Error(`${objError.type.generic}`);
        }
        // if basket exist, to convert and add product 
        if (LocalStorage._verifIfItemExist(this.keyBasket)) {
            console.log("exist");
        // else, init the basket in localStorage with first product (after be converted)
        } else {
            this.defBasket.productsBasket.push(product);
            const strJsonFromObj = Utils._workWithJSON(this.defBasket, 'toJSON');
            LocalStorage._setItem(this.keyBasket, strJsonFromObj);
            console.log('éxiste pas');
        }
    }

    
}