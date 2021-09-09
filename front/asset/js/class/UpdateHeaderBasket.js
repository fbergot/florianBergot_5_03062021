import { objError } from "../errors/err.js";
import LocalStorage from "./LocalStorage.js";
import Utils from "./Utils.js";
/**
 * Update basket in header
 * @singletoh
 * @export
 * @class UpdateHeaderBasket
 */
export default class UpdateHeaderBasket {
  /** @var {Instance of UpdateHeaderBasket|null} */
  static instance = null;
  static tagOfTarget = "#basketProduct";

  /**
   *Creates an instance of UpdateHeaderBasket.
   * @use objError
   * @param {String} tagTargetHTML
   * @memberof UpdateHeaderBasket
   */
  constructor(tagTargetHTML) {
    this.targetHTML = document.querySelector(tagTargetHTML);
  }

  /**
   * Make unique instance of UpdateHeaderBasket (singleton)
   * @static
   * @returns
   * @memberof UpdateHeaderBasket
   */
  static _getInstance() {
    if (this.instance === null) {
        this.instance = new UpdateHeaderBasket(this.tagOfTarget);
        return this.instance;
    }
    return this.instance;
  }

  /**
   * Update header basket
   * @use LocalStorage class
   * @use Utils class
   * @throw
   * @returns {void}
   * @memberof UpdateHeaderBasket
   */
  update() {
    try {
      // get number of item in "basket" (localStorage)
      /** @var {null|String} */
      const basket = LocalStorage._getItem("basket");
      var objFromStrJSON = Utils._workWithJSON(basket, "toOBJ");
    } catch (err) {
      console.error(err);
    }
    if (objFromStrJSON !== null) {
        try {
            this.targetHTML.innerText = this.computeTotalInBasket(objFromStrJSON);
            return;            
        } catch(err) {
            console.error(err);
        }
    }
    this.targetHTML.innerText = 0;
  }

  /**
   * Compute total product in basket
   * @param {Array} productsBasket
   * @returns {Number}
   * @memberof UpdateHeaderBasket
   */
  computeTotalInBasket({ productsBasket }) {
    if (!Array.isArray(productsBasket)) {
      throw Error(`${objError.type.generic}`);
    }
    const { quantity } = productsBasket.reduce(({ quantity }, curr) => {
        return { quantity: quantity + curr.quantity };
    });
    return quantity;
  }
}