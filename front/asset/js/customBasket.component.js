import Basket from "./class/basket.js";
import LocalStorage from "./class/LocalStorage.js";
import Utils from "./class/Utils.js";
import { objError } from "./errors/err.js";

export default class CustomBasket extends HTMLElement {
    constructor() {
        super();
        // this.linesBasket = "";
        this.keyBasket = 'basket';
        this.allSubTotal = [];
        this.messageNoItem = 'Votre panier est vide';
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
                    <tr part='head_tr'>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Sous total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id='bodyTable'></tbody>
            </table>`;
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
        return `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input class='inpNumProd' data-product='${item.name}' part='numberOfProd' min='1' value="${item.quantity}" type="number">
                </td>
                <td>${Utils._divide(item.price, 100)}€</td>
                <td>${this.computeSubtotal(Number.parseInt(item.quantity), Number.parseInt(Utils._divide(Number.parseInt(item.price), 100)))}€</td>               
                <td>
                    <button part='removeItem' class='remove' data-productName="${item.name}">Supprimer</button>
                </td>
            </tr>`;
    }

    /**
     * Loop in array of product for create the lines in basket
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
            this.linesBasket += this.createLineOfData(element);
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
            elem.addEventListener('input', (e) => {
                console.log('test');
                Basket._getInstance().updateQuantity(e.target.dataset.product, Number.parseInt(e.target.value));
                this.construct();
            }); 
        });
    }

    addDeleteEvent() {
        const buttons = [...this.shadowRoot.querySelectorAll('.remove')];
        buttons.forEach((elem) => {
            elem.addEventListener('click', (e) => {
                Basket._getInstance().removeProduct(e.target.dataset.productname);
                this.construct();
            })
        })
    }

    /**
     * Build from product in localStorage
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
            // get in localstorage
            const jsonBasket = LocalStorage._getItem(this.keyBasket);
            const objFromStrJSON = Utils._workWithJSON(jsonBasket, "toOBJ");
            this.loopOnBasket(objFromStrJSON.productsBasket);
            this.render("#bodyTable", this.linesBasket);
            this.addInputEvent();
            this.addDeleteEvent();
        } catch (err) {
            console.error(err);
        }        
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