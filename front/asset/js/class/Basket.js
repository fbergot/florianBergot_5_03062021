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
     * @use Utils class
     * @use objError obj
     * @returns {void}
     * @param {Object} product
     * @memberof Basket
     */
    static _addInBasket(product) {
        if (typeof product !== "object") {
            throw Error(`${objError.type.generic}`);
        }
        try {
            /** @var {Boolean} */
            var stateBasket = (LocalStorage._verifIfItemExist(this.keyBasket));
        } catch (err) {
            console.error(err);
        }

        if (stateBasket) {
            // if basket exist, to convert and add product in a list of products
            console.log("exist");
        } else {
            // init the basket in localStorage with first product (after be converted)
            this.defBasket.productsBasket.push(product);
            try {
                const strJsonFromObj = Utils._workWithJSON(this.defBasket, "toJSON");
                LocalStorage._setItem(this.keyBasket, strJsonFromObj);
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     *
     * Remove one product in localStorage basket
     * @static
     * @param {String} nameProduct
     * @memberof Basket
     */
    static _removeInBasket(nameProduct) {}

    
}