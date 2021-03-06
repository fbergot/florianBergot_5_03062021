import Basket from "./class/basket.js";
import LocalStorage from "./class/LocalStorage.js";
import UpdateHeaderBasket from "./class/UpdateHeaderBasket.js";
import Utils from "./class/Utils.js";
import { objError } from "./errors/err.js";

/**
 * Custom basket element
 * @use Basket class
 * @use LocalStorage class
 * @use Utils class
 * @use objError obj
 * @export
 * @class CustomBasket
 * @extends {HTMLElement}
 */
export default class CustomBasket extends HTMLElement {
    /**
     * Creates an instance of CustomBasket.
     * @memberof CustomBasket
     */
    constructor() {
        super();
        this.linesBasket;
        this.allSubTotal = [];
        this.keyBasket = 'basket';
        this.containerForm = document.querySelector("#contFormHidden");
        this.messageNoItem = 'aucun article dans votre panier';
        // attach root of shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div>
                <h1 part='basketTitle'>Voici votre panier</h1>
                <div part='containerBasket' id='internalBasketContainer'>
                </div>
            </div>
                `;
    }

    /**
     * Compute subTotal
     * @use objError obj
     * @param {Number} quantity
     * @param {Number} price
     * @returns {Number}
     * @memberof CustomBasket
     */
    computeSubtotal(quantity, price) {
        if (typeof quantity !== 'number' || typeof price !== 'number') {
            throw Error(`${objError.type.generic}`);
        }
        return (quantity * price);
    }

    /**
     * Build basic structure of table
     * @return. {String}
     * @memberof CustomBasket
     */
    createStructureTable() {        
        return `
            <table part='basketTable'>
                <thead part='basketThead'>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix</th>
                        <th>Sous total</th>
                        <th part='cellBut'></th>
                    </tr>
                </thead>
                <tbody id='bodyTable'></tbody>
            </table>
            <div id='totalPrice'></div>
            <style>         
                table, th {
                    padding: .25rem;
                    text-align: center;
                    font-weight: 500;
                    border: 1px solid rgb(189, 184, 184);
                    border-collapse: collapse;
                }
                               
                #internalBasketContainer {
                    display: flex;
                    flex-direction: column;
                }
                #totalPrice {
                    display: flex;
                    justify-content: center;
                }
            </style>
            `;
    }

    /**
     * Build string of cell for table with item data (name, quantity....)
     * @use objError obj
     * @use Utils class
     * @param {{quantity:Number, price:Number, lenses:Array<String>,
     *  name:String, description:String, imageUrl:String, _id:String }} item
     * @return {String}
     * @memberof CustomBasket
     */
    createLineOfData(item) {
        if (typeof item !== 'object' || Array.isArray(item)) {
            throw Error(`${objError.type.generic}`);
        }
        try {
            if (!item.imageUrl || !item.name || !item.price || !item.quantity) {
                throw Error("Missing property");
            } 
            var price = Utils._divide(item.price, 100);
            var subTotal = this.computeSubtotal(item.quantity, price);
            this.allSubTotal.push(subTotal);
        } catch (err) {
            console.error(err.message);
        }
        return `
            <tr>
                <td>
                    <div part='cellProduct'>
                        <img part='prodImg' src='${item.imageUrl}'/>
                        <p part='prodName'>${item.name}</p>
                    </div>
                </td>
                <td>
                    <input class='inpNumProd' data-product='${item.name}' part='numberOfProd' min='1' value="${item.quantity}" type="number">
                </td>
                <td>${price}€</td>
                <td>${subTotal}€</td>               
                <td>
                    <button part='removeItem' class='remove' data-productName="${item.name}">X</button>
                </td>
            </tr>
            `;
    }

    /**
     * Loop in product array for create the lines in <table> basket
     * @use objError obj
     * @param {Array<{}>} arrayProducts
     * @return {void}
     * @memberof CustomBasket
     */
    loopOnBasket(arrayProducts) {
        if (!Array.isArray(arrayProducts)) {
            throw Error(`${objError.type.generic}`);
        }
        try {
            this.linesBasket = "";
            arrayProducts.forEach((element) => {
                    this.linesBasket += this.createLineOfData(element);
                });
        } catch (err) {
            console.error(err);
        }
    }
    
    /**
     * Called when customEl is add in DOM
     * @returns {void}
     * @memberof CustomBasket
     */
    connectedCallback() {                    
        this.construct();
        if (!LocalStorage._getItem('basket')) {
            this.containerForm.setAttribute("hidden", "true");           
        }
    }

    /**
     * Add event on inputs (number product)
     * @use Basket class
     * @use objError obj
     * @param {Array<HTMLElement>} inputs
     * @returns {void}
     * @memberof CustomBasket
     */
    addInputEvent(inputs) {
        if (!Array.isArray(inputs) || inputs.length === 0) {
            throw Error(`${objError.type.generic} or length 0`);
        }
        inputs.forEach((elem) => {
            elem.addEventListener('change', (e) => {
                try {
                    Basket._getInstance().updateQuantity(
                        e.target.dataset.product,
                        // fix value on 1 per default if <= 0
                        Number.parseInt(e.target.value) <= 0 ? (
                            1) : Number.parseInt(e.target.value));
                } catch (err) {
                    console.error(err);
                }
                this.construct();
            }, false); 
        });
    }

    /**
     * Add events listeners
     * @use objError obj
     * @use Basket class
     * @use UpdateHeaderBasket class
     * @param {Array<HTMLElement>} buttons
     * @return {void}
     * @memberof CustomBasket
     */
    addDeleteEvent(buttons) {
        if (!Array.isArray(buttons) || buttons.length === 0) {
          throw Error(`${objError.type.generic} or length 0`);
        }
        buttons.forEach((elem) => {
            elem.addEventListener('click', (e) => {
                try {
                    const state = Basket._getInstance().removeProduct(e.target.dataset.productname);
                    if (state === "empty") {
                        this.containerForm.setAttribute('hidden', "true");
                    }
                } catch (err) {
                    console.error(err);
                }
                this.construct();
                UpdateHeaderBasket._getInstance().update();                
            }, false)
        })
    }

    /**
     * Build line of table from product in localStorage
     * @use Utils class
     * @use LocalStorage class
     * @return {void}
     * @memberof CustomBasket
     */
    construct() {
        try {
            if (!LocalStorage._verifIfItemExist(this.keyBasket)) {
                this.render("#internalBasketContainer", `<p part='noItem'> ${this.messageNoItem}</p>`);
                return;
            }
            // create structure <table>
            this.render("#internalBasketContainer", this.createStructureTable());
            this.allSubTotal = [];
            // get obj in localstorage
            const jsonBasket = LocalStorage._getItem(this.keyBasket);
            const objFromStrJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
            // build
            this.loopOnBasket(objFromStrJSON.productsBasket);
            this.render("#bodyTable", this.linesBasket);
            this.render('#totalPrice', `<p part='totalPrice'>Total : ${this.computeTotal()}€</p>`);
            this.addInputEvent([
              ...this.shadowRoot.querySelectorAll(".inpNumProd"),
            ]);
            this.addDeleteEvent([
              ...this.shadowRoot.querySelectorAll(".remove"),
            ]);
        } catch (err) {
            console.error(err);
        }        
    }

    /**
     * Computed the total price (all subTtotals)
     * @use LocalStorage class
     * @returns {Number}
     * @memberof CustomBasket
     */
    computeTotal() {
        const total = this.allSubTotal.reduce((acc, curr) => acc + curr);
        LocalStorage._setItem('totalPrice', `${total}`)
        return total;
    }
    /**
     * Add data in shadow DOM element
     * @use objError obj
     * @param {String} tag
     * @param {String} data
     * @return {void}
     * @memberof CustomBasket
     */
    render(tag, data) {
        if (typeof tag !== 'string' || typeof data !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        this.shadowRoot.querySelector(tag).innerHTML = `${data}`;
    }
}