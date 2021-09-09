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
                const objFromJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
                // if product present in basket, add his quantity else add product
                this.verifIsPresent(objFromJSON, product);
                // re add the new basket in localStorage
                const reconvertObjInJSON = Utils._workWithJSON(objFromJSON, 'toJSON');
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
     * Update the quantity per product
     * @param {String} productName
     * @param {Number} quantity
     * @memberof Basket
     */
    updateQuantity(productName, quantity) {
        if (typeof productName !== "string" || typeof quantity !== 'number') {
            throw Error(`${objError.type.generic}`);
        }
        try {
            // get basket in locStor
            const jsonBasket = LocalStorage._getItem(this.keyBasket);
            const objFromJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
            // update quantity
            const product = this.findProduct(objFromJSON.productsBasket, productName);
            if (product) {
                product.quantity = quantity;
            }
            // re add the new basket in locStor
            const reconvertObjInJSON = Utils._workWithJSON(objFromJSON, 'toJSON');
            LocalStorage._setItem(this.keyBasket, reconvertObjInJSON);
            UpdateHeaderBasket._getInstance().update();
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Find product with his name
     * @param {Array} arrayProduct
     * @param {String} prodName
     * @returns {Object|undefined}
     * @memberof Basket
     */
    findProduct(arrayProduct, productName) {
        if (!Array.isArray(arrayProduct) || typeof productName !== "string") {
            throw Error(`${objError.type.generic}`);
        }
        return arrayProduct.find((elem) => elem.name === productName);
    }

    /**
     *
     *
     * @param {Array} arrayProduct
     * @param {String} productName
     * @returns {Number} (-1 if false for all element)
     * @memberof Basket
     */
    findIndexProduct(arrayProduct, productName) {
        if (typeof productName !== "string" || !Array.isArray(arrayProduct)) {
            throw Error(`${objError.type.generic}`);
        }
        return arrayProduct.findIndex((elem) => elem.name === productName);
    }

    /**
     * Remove one product in localStorage basket
     * @param {String} nameProduct
     * @returns {void}
     * @memberof Basket
     */
    removeProduct(productName) {
        if (typeof productName !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        try {
            // get basket in locStor
            const jsonBasket = LocalStorage._getItem(this.keyBasket);
            const objFromJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
            const index = this.findIndexProduct(objFromJSON.productsBasket, productName);
            objFromJSON.productsBasket.splice(index, 1);
            // verif state
            if (objFromJSON.productsBasket.length === 0) {
                this.clearBasket();
                return;
            } 
            // re add the new basket in locStor
            const reconvertObjInJSON = Utils._workWithJSON(objFromJSON, 'toJSON');
            LocalStorage._setItem(this.keyBasket, reconvertObjInJSON);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Clear localStorage
     * @use LocalStorage class
     * @memberof Basket
     */
    clearBasket() {
        LocalStorage._reset();
    }   
}