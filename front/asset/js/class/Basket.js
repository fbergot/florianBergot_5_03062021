import Utils from "./Utils.js";
import LocalStorage from "./LocalStorage.js";
import { objError } from "../errors/err.js";
import UpdateHeaderBasket from "./UpdateHeaderBasket.js";
/**
 * all for the basket
 * @singleton
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
    /** @var {null|Instance of Basket} */
    static instance = null;

    /**
     * Creates an instance of Basket.
     * @param {String} keyBasket
     * @param {Object<Array>} definitionBasket
     * @memberof Basket
     */
    constructor(keyBasket, definitionBasket) {
        this.keyBasket = keyBasket;
        this.defBasket = definitionBasket;
    }

    /**
     * Allow get unique instance of Basket class (singleton)
     * @returns {Instance of Basket}
     * @memberof Basket
     */
    static _getInstance() {
        if (this.instance === null) {
            this.instance = new Basket(this.keyBasket, this.defBasket);
            return this.instance;
        }
        return this.instance;
    }
    /**
     * Create the basket with first product
     * @static
     * @param {Object} firstProduct
     * @throw
     * @memberof Basket
     */
    createBasket(firstProduct) {
        if (typeof firstProduct !== 'object') {
            throw Error(`${objError.type.generic}`);
        }
        this.defBasket.productsBasket.push(firstProduct);
        try {
          /** @var {String} */
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
    addInBasket(product) {
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
                const jsonBasket = LocalStorage._getItem(this.keyBasket);
                const objFromStrJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
                // add product
                objFromStrJSON.productsBasket.push(product);
                const reconvertObjInJSON = Utils._workWithJSON(objFromStrJSON, 'toJSON');
                // re add the new basket in locStor
                LocalStorage._setItem(this.keyBasket, reconvertObjInJSON);
                UpdateHeaderBasket._getInstance().update();
            } catch (err) {
                console.error(err);
            }
        } else {
            try {               
                // init the basket in localStorage with first product (after be converted)
                this.createBasket(product);
                UpdateHeaderBasket._getInstance().update();
               
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     *
     * Remove one product in localStorage basket
     * @param {String} nameProduct
     * @memberof Basket
     */
    removeInBasket(nameProduct) {}

    
}