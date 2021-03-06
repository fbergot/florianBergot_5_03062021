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
  static keyBasket = "basket";
  static defBasket = { productsBasket: [] };
  /** @property {null|InstanceType<Basket>} instance*/
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
   * @use Utils class
   * @use objError obj
   * @param {{quantity:Number, price:Number, lenses:Array<String>,
   *  name:String, description:String, imageUrl:String, _id:String }} firstProduct
   * @throw
   * @return {void}
   * @memberof Basket
   */
  createBasket(firstProduct) {
    if (typeof firstProduct !== "object" || Array.isArray(firstProduct)) {
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
    if (
      typeof objFromStrJSON !== "object" ||
      Array.isArray(objFromStrJSON) ||
      typeof product !== "object" ||
      Array.isArray(product)
    ) {
      throw Error(`${objError.type.generic}`);
    }
    const verifIsPresent = objFromStrJSON.productsBasket.find((elem) => {
      if (!elem.name || !product.name) {
        throw Error(`${objError.utils.missProp}`);
      }
      return elem.name === product.name;
    });
    // if present add his quantity
    if (verifIsPresent) {
      if (!verifIsPresent.quantity) {
        throw Error(`${objError.utils.missProp}`);
      }
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
   * @use UpdateHeaderBasket class
   * @use objError obj
   * @param {{quantity:Number, price:Number, lenses:Array<String>,
   *  name:String, description:String, imageUrl:String, _id:String }} product
   * @throw
   * @return {void}
   * @memberof Basket
   */
  addInBasket(product) {
    if (typeof product !== "object" || Array.isArray(product)) {
      throw Error(`${objError.type.generic}`);
    }
    try {
      /** @var {Boolean} */
      var stateBasket = LocalStorage._verifIfItemExist(this.keyBasket);
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
        const reconvertObjInJSON = Utils._workWithJSON(objFromJSON, "toJSON");
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
   * @use UpdateHeaderBasket class
   * @use Utils class
   * @use LocalStorage class
   * @use objError obj
   * @param {String} productName
   * @param {Number} quantity
   * @return {void}
   * @memberof Basket
   */
  updateQuantity(productName, quantity) {
    if (typeof productName !== "string" || typeof quantity !== "number") {
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
      } else throw Error("Product absent");
      // re add the new basket in locStor
      const reconvertObjInJSON = Utils._workWithJSON(objFromJSON, "toJSON");
      LocalStorage._setItem(this.keyBasket, reconvertObjInJSON);
      UpdateHeaderBasket._getInstance().update();
    } catch (err) {
      if (err.message !== "Product absent") console.error(err);
      else throw Error(err.message);
    }
  }

  /**
   * Find product with his name
   * @use objError obj
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
   * find index of product in array
   * @use objError obj
   * @param {Array<{}>} arrayProduct
   * @param {String} productName
   * @return {Number} (-1 if not element)
   * @memberof Basket
   */
  findIndexProduct(arrayProduct, productName) {
    if (!Array.isArray(arrayProduct) || typeof productName !== "string") {
      throw Error(`${objError.type.generic}`);
    }
    return arrayProduct.findIndex((elem) => elem.name === productName);
  }

  /**
   * Remove one product in localStorage basket
   * @use LocalStorage class
   * @use Utils class
   * @use objError obj
   * @param {String} productName
   * @return {void}
   * @memberof Basket
   */
  removeProduct(productName) {
    if (typeof productName !== "string") {
      throw Error(`${objError.type.generic}`);
    }
    try {
      // get basket in locStor
      const jsonBasket = LocalStorage._getItem(this.keyBasket);
      if (!jsonBasket) {
        throw Error("Basket is not in localStorage");
      }
      const objFromJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
      // find & remove product
      const indexProd = this.findIndexProduct(
        objFromJSON.productsBasket,
        productName
      );
      objFromJSON.productsBasket.splice(indexProd, 1);
      // verif state (remove basket item if empty)
      if (objFromJSON.productsBasket.length === 0) {
        this.clearBasket(this.keyBasket);
        return "empty";
      }
      // re add the new basket in locStor
      const reconvertObjInJSON = Utils._workWithJSON(objFromJSON, "toJSON");
      LocalStorage._setItem(this.keyBasket, reconvertObjInJSON);
      return true;
    } catch (err) {
      if (err.message !== "Basket is not in localStorage") console.error(err);
      else throw Error(err.message);
    }
  }

  /**
   * Remove an item in local storage
   * @use LocalStorage class
   * @use objError obj
   * @return {void}
   * @memberof Basket
   */
  clearBasket(key) {
    if (typeof key !== "string" || key == "") {
      throw Error(`${objError.type.generic} or empty`);
    }
    LocalStorage._removeItem(key);
  }
}