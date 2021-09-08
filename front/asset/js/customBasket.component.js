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
        this.allSubTotal;
        this.keyBasket = 'basket';
        this.messageNoItem = 'aucun article dans votre panier';
        // attach root of shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div part='containerBasket' id='internalBasketContainer'>
            </div>`;
    }

    /**
     * Compute subTotal
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
     * @returns {String}
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
                        <th class='cellBut'></th>
                    </tr>
                </thead>
                <tbody id='bodyTable'></tbody>
            </table>
            <div part='totalPrice' id='totalPrice'></div>
            `;
    }

    /**
     * Build string of cell for table with item data (name, quantity....)
     * @param {Object} item
     * @returns {String}
     * @memberof CustomBasket
     */
    createLineOfData(item) {
        if (typeof item !== 'object' && !Array.isArray(item)) {
            throw Error(`${objError.type.generic}`);
        }
        try {
            var price = Utils._divide(item.price, 100);
            var subTotal = this.computeSubtotal(item.quantity, price);
            this.allSubTotal.push(subTotal);
        } catch (err) {
            console.error(err);
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
                <td class='cellBut'>
                    <button part='removeItem' class='remove' data-productName="${item.name}">X</button>
                </td>
            </tr>
            <style>         
                table,th,td{
                    padding: .25rem;
                    text-align: center;
                    border: 1px solid grey;
                    border-collapse: collapse;
                }
                .inpNumProd {
                    width: 40px;
                    height: 20px
                }
                .cellBut {
                    border: none;
                    border-color: transparent;
                }
            </style>
            `;
    }

    /**
     * Loop in product array for create the lines in <table> basket
     * @param {Array} arrayProducts
     * @returns {void}
     * @memberof CustomBasket
     */
    loopOnBasket(arrayProducts) {
        if (!Array.isArray(arrayProducts)) {
            throw Error(`${objError.type.generic}`);
        }
        this.linesBasket = "";
        arrayProducts.forEach((element) => {
            try {
                this.linesBasket += this.createLineOfData(element);
            } catch (err) {
                console.error(err);
            }
        });
    }
    
    /**
     * Called when customEl is add in DOM
     * @returns {void}
     * @memberof CustomBasket
     */
    connectedCallback() {                    
        this.construct();
    }

    /**
     * Add event on inputs (number product)
     * @use Basket class
     * @returns {void}
     * @memberof CustomBasket
     */
    addInputEvent() {
        const inputs = [...this.shadowRoot.querySelectorAll(".inpNumProd")];
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
            }); 
        });
    }

    addDeleteEvent() {
        const buttons = [...this.shadowRoot.querySelectorAll('.remove')];
        buttons.forEach((elem) => {
            elem.addEventListener('click', (e) => {
                try {
                    Basket._getInstance().removeProduct(e.target.dataset.productname);
                } catch (err) {
                    console.error(err);
                }
                this.construct();
                UpdateHeaderBasket._getInstance().update();                
            })
        })
    }

    /**
     * Build line of table from product in localStorage
     * @use Utils class
     * @use LocalStorage class
     * @returns {void}
     * @memberof CustomBasket
     */
    construct() {
        try {
            if (!LocalStorage._verifIfItemExist(this.keyBasket)) {
                this.render("#internalBasketContainer", this.messageNoItem);
                return;
            }
            // create structure <table>
            this.render("#internalBasketContainer", this.createStructureTable());
            this.allSubTotal = [];
            // get in localstorage
            const jsonBasket = LocalStorage._getItem(this.keyBasket);
            const objFromStrJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
            this.loopOnBasket(objFromStrJSON.productsBasket);
            this.render("#bodyTable", this.linesBasket);
            this.render('#totalPrice', `Total : ${this.computeTotal()}€`);
            this.addInputEvent();
            this.addDeleteEvent();
        } catch (err) {
            console.error(err);
        }        
    }

    /**
     * Computed the total price (all subTtotals)
     * @returns {Number}
     * @memberof CustomBasket
     */
    computeTotal() {
        return this.allSubTotal.reduce((acc, curr) => acc + curr);
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
        if (typeof data !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        this.shadowRoot.querySelector(tag).innerHTML = `${data}`;
    }
}