import Utils from "./Utils.js";
import LocalStorage from "./LocalStorage.js";
import { objError } from "../errors/err.js";
import UpdateHeaderBasket from "./UpdateHeaderBasket.js";
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
     *
     * @static
     * @param {Object} firstProduct
     * @throw
     * @memberof Basket
     */
    static _createBasket(firstProduct) {
        if (typeof firstProduct !== 'object') {
            throw Error(`${objError.type.generic}`);
        }
        this.defBasket.productsBasket.push(firstProduct);
        try {
          const strJsonFromObj = Utils._workWithJSON(this.defBasket, "toJSON");
          LocalStorage._setItem(this.keyBasket, strJsonFromObj);
        } catch (err) {
          console.error(err);
        }
    }
    /**
     * add product in basket
     * @static
     * @use LocalStorage class
     * @use Utils class
     * @use objError obj
     * @param {Object} product
     * @throw
     * @returns {void}
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
            try {
                // get basket in locStor
                const basket = LocalStorage._getItem(this.keyBasket);
                const objFromStrJSON = Utils._workWithJSON(basket, "toOBJ");
                // add product
                objFromStrJSON.productsBasket.push(product);
                const convertObjInJSON = Utils._workWithJSON(objFromStrJSON, 'toJSON');
                // re add the new basket in locStor
                LocalStorage._setItem(this.keyBasket, convertObjInJSON);
                UpdateHeaderBasket._getInstance().update();
            } catch (err) {
                console.error(err);
            }
        } else {
            try {               
                // init the basket in localStorage with first product (after be converted)
                this._createBasket(product);
                UpdateHeaderBasket._getInstance().update();
               
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