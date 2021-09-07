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
     * Verif is product is present in basket (add product or add quantity)
     * @use objError
     * @param {Object} objFromStrJSON
     * @param {Object} product
     * @memberof Basket
     */
    verifIsPresent(objFromStrJSON, product) {
        if (typeof objFromStrJSON !== "object" || typeof product !== "object") {
            throw Error(`${objError.type.generic}`);
        }
        const verifIsPresent = objFromStrJSON.productsBasket.find((elem) => {
            return elem.name === product.name;
        })
        // if present add his quantity
        if (verifIsPresent) {
            verifIsPresent.quantity = Number.parseInt(verifIsPresent.quantity) + 1;
        // else, add product
        } else {
            objFromStrJSON.productsBasket.push(product);
        }
    }
    /**
     * add product in basket
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
                // if product present in basket, add his quantity else add product
                this.verifIsPresent(objFromStrJSON, product);
                // add product
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