import Utils from './class/Utils.js';
import LocalStorage from './class/LocalStorage.js';
import { objError } from './errors/err.js';
/**
 *
 *
 * @export
 * @class CustomConfirm
 * @extends {HTMLElement}
 */
export default class CustomConfirm extends HTMLElement {
    /**
     *Creates an instance of CustomConfirm.
     * @memberof CustomConfirm
     */
    constructor() {
        super();
        this.lines = "";
        this.key = "responseApi";
        this.innerHTML =
            `<div>
                ${this.createTable()}
                <p>Le prix total de la commande est de <strong>${this.getPrice()} euros.</strong></p>
                <p>Votre identifiant de commande est : " ${this.getCommandId()} "</p>
            </div>`;
        
    }

    /**
     * Get totalPrice item in local storage
     * @use LocalStorage class
     * @returns {String}
     * @memberof CustomConfirm
     */
    getPrice() {
        try {
            var price = LocalStorage._getItem('totalPrice');
        } catch (err) {
            console.error(err);
        }
        return price || `${0}`;
    }

    /**
     * Get id of commande
     * @use LocalStorage class
     * @use Utils class
     * @returns {String}
     * @memberof CustomConfirm
     */
    getCommandId() {
        try {
            const jsonResponse = LocalStorage._getItem(this.key);
            var objFromStrJSON = Utils._workWithJSON(jsonResponse, "toOBJ");
        } catch (err) {
            console.error(err);
        }
        return objFromStrJSON.orderId || "";
    }

    /**
     *
     * @return {String}
     * @memberof CustomConfirm
     */
    createTable() {
        return `
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Produit</th>
                        <th scope="col">Prix</th>
                    </tr>
                </thead>
                <tbody id='bodyTable'>                    
                </tbody>
            </table>
        `;
    }

    /**
     * Build the line product in table
     * @use Utils class
     * @use objError obj
     * @param {{lenses:Array<String>, _id:String, name:String,
     *  price:Number, description:String, imageUrl:String}} product
     * @returns {String}
     * @memberof CustomConfirm
     */
    createLine(product) {
        if (typeof product !== 'object' || Array.isArray(product)) {
            throw Error(`${objError.type.generic}`);
        }
        try {
            var price = Utils._divide(product.price, 100);
        } catch (err) {
            console.error(err);
        }
        return `
            <tr>
                <td scope='row'>${product.name}</td>
                <td>${price}€</td>
            </tr>
        `;
    }

    /**
     * Called when custom is add in DOM
     * @return {void}
     * @memberof CustomConfirm
     */
    connectedCallback() {
        this.buildLinesOfProducts();
    }

    /**
     * Build lines for table of products
     * @use LocalStorage class
     * @use Utils class
     * @return {void}
     * @memberof CustomConfirm
     */
    buildLinesOfProducts() {
        try {
            // get obj in localstorage
            const jsonResponse = LocalStorage._getItem(this.key);
            const objFromStrJSON = Utils._workWithJSON(jsonResponse, "toOBJ");
            this.commandId = objFromStrJSON.orderId;
            // build table lines
            this.loopOnProducts(objFromStrJSON.products);
            this.querySelector('#bodyTable').innerHTML = this.lines;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Loop in product array for create the lines in <table> basket
     * @use objError obj
     * @param {Array<{}>} arrayProducts
     * @return {void}
     * @memberof CustomBasket
     */
    loopOnProducts(arrayProducts) {
        if (!Array.isArray(arrayProducts)) {
            throw Error(`${objError.type.generic}`);
        }
        try {
            arrayProducts.forEach((product) => {
                    this.lines += this.createLine(product);
                });
        } catch (err) {
            console.error(err);
        }
    }

}