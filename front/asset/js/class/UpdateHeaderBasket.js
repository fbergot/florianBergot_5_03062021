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
    /** @property {InstanceType<UpdateHeaderBasket>|null} */
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
   * @returns {InstanceType<UpdateHeaderBasket>}
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
			var objFromStrJSON;
			if (basket) {
				objFromStrJSON = Utils._workWithJSON(basket, "toOBJ");
			}
		} catch (err) {
				console.error(err);
		}
		if (objFromStrJSON) {
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
   * @use objError obj
   * @param {{productsBasket: Array<{quantity:Number}>}} objFromJSON
   * @returns {Number|NaN}
   * @memberof UpdateHeaderBasket
   */
  	computeTotalInBasket(objFromJSON) {
		if (Array.isArray(objFromJSON) || typeof objFromJSON !== 'object') {
			throw Error(`${objError.type.generic}`);
		}
		const { quantity } = objFromJSON.productsBasket.reduce(({ quantity }, curr) => {
			return { quantity: quantity + curr.quantity };
		});
		if (!quantity) throw Error('Missing property quantity');
		return quantity;
  	}
}