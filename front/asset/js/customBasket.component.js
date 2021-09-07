import LocalStorage from "./class/LocalStorage.js";
import Utils from "./class/Utils.js";
import { objError } from "./errors/err.js";

export default class CustomBasket extends HTMLElement {
    constructor() {
        super();
        this.linesBasket = "";
        this.keyBasket = 'basket';
        this.allSubTotal = [];
        // attach shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div part='containerBasket' id='internalBasketContainer'>
            </div>`;
    }

    computeSubtotal(quantity, price) {
        if (typeof quantity !== 'number' || typeof price !== 'number') {
            throw Error(`${objError.type.generic}`);
        }
        return quantity * price;
    }

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
                <tbody id='bodyTable'>
                    
                </tbody>
            </table>`;
    }

    /**
     * string of cell for table returned
     * @param {Object} item
     * @returns {String}
     * @memberof CustomBasket
     */
    createLineOfData(item) {
        if (typeof item !== 'object') {
            throw Error(`${objError.type.generic}`);
        }
        return `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input part='numberOfProd' min='1' value="${item.quantity}" type="number">
                </td>
                <td>${Utils._divide(item.price, 100)}€</td>
                <td>${this.computeSubtotal(item.quantity, Utils._divide(item.price, 100))}€</td>               
                <td>
                    <button part='removeItem' class='remove' data-productName="${item.name}">Supprimer</button>
                </td>
            </tr>
        `;
    }

    loopOnBasket(arrayProducts) {
        if (!Array.isArray(arrayProducts)) {
            throw Error(`${objError.type.generic}`);
        }
        arrayProducts.forEach((element) => {
            console.log(this.linesBasket);
            this.linesBasket += this.createLineOfData(element);
        });
        this.render("#bodyTable", this.linesBasket);
    }
    
    /**
     * Called when customEl is add in DOM
     * @use LocalStorage class
     * @returns {void}
     * @memberof CustomBasket
     */
    connectedCallback() {
        try {
            if (!LocalStorage._verifIfItemExist(this.keyBasket)) {
                const noBasket = `Votre panier est vide`;
                this.render("#internalBasketContainer", noBasket);
                return;
            }
            // create structure <table>
            this.render("#internalBasketContainer", this.createStructureTable());
            // get in localstorage
            const jsonBasket = LocalStorage._getItem(this.keyBasket);
            const objFromStrJSON = Utils._workWithJSON(jsonBasket, 'toOBJ');
            this.loopOnBasket(objFromStrJSON.productsBasket);
            console.log(this.linesBasket)
            

        } catch (err) {
            console.error(err);
        }

    }

    /**
     * Add data in shadow DOM
     * @use objError obj
     * @param {*} data
     * @return {void}
     * @memberof CustomBasket
     */
    render(tag,data) {
        if (typeof data !== 'string') {
            throw Error(`${objError.type.generic}`);
        }
        this.shadowRoot.querySelector(tag).innerHTML = `${data}`;
    }
}