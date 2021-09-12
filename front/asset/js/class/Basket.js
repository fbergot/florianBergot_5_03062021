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
     * @param {{productsBasket:[]}} definitionBasket
     * @memberof Basket
     */
    constructor(keyBasket, definitionBasket) {
        this.keyBasket = keyBasket;
        this.defBasket = definitionBasket;
    }

    /**
     * Allow get unique instance of Basket class (singleton)
     * @returns {InstanceType<Basket>}
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
     * @param {{quantity:Number, price:Number, lenses:Array<String>,
     *  name:String, description:String, imageUrl:String, _id:String }} firstProduct
     * @throw
     * @return {void}
     * @memberof Basket
     */
    createBasket(firstProduct) {
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
     * Verif is product is present in basket (add product or add quantity)
     * @use objError
     * @param {{productsBasket:Array}} objFromStrJSON
     * @param {{quantity:Number, price:Number, lenses:Array<String>,
     *  name:String, description:String, imageUrl:String, _id:String }} product
     * @return {void}
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
     * @param {{quantity:Number, price:Number, lenses:Array<String>,
     *  name:String, description:String, imageUrl:String, _id:String }} product
     * @throw
     * @return {void}
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
                // init the basket in localStorage with first product
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
     * @return {void}
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
     * @return {Number} (-1 if false for all element)
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
     * @param {String} productName
     * @return {void}
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
            // find & remove product
            const indexProd = this.findIndexProduct(objFromJSON.productsBasket, productName);
            objFromJSON.productsBasket.splice(indexProd, 1);
            // verif state (remove basket item if empty)
            if (objFromJSON.productsBasket.length === 0) {
                this.clearBasket(this.keyBasket);
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
     * Remove an item in local storage
     * @use LocalStorage class
     * @return {void}
     * @memberof Basket
     */
    clearBasket(key) {
        if (typeof key !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        LocalStorage._removeItem(key);
    }   
}