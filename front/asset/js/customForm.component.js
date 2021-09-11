import { objError } from "./errors/err.js";
import Form from "./class/Form.js";
import Validation from "./class/Validation.js";
import Utils from "./class/Utils.js";
import LocalStorage from "./class/LocalStorage.js";
import FetchData from "./class/FetchData.js";

/**
 *
 * Custom element <custom-form>
 * @use objError obj
 * @use Form class
 * @use Validation class
 * @use Utils class
 * @use LocalStorage class
 * @use FetchData class
 * @export
 * @class CustomForm
 * @extends {HTMLElement}
 */
export default class CustomForm extends HTMLElement {
    /**
     *Creates an instance of CustomForm.
     * @memberof CustomForm
     */
    constructor() {
        super();
        this.innerHTML =
            `<div id='internalFormContainer'>
            ${this.createForm()}
            </div>`;
        /** @var {Array<HTMLInputElement>} */
        this.allInputs = [...document.querySelectorAll('input')];
        this.form = document.querySelector('form');
        this.submitButton = document.querySelector('#submit');
        this.keyStorage = "responseApi";
    }
    /**
     * Called when customEl is add in DOM
     * @returns {void}
     * @memberof CustomBasket
     */
    connectedCallback() {
        this.addEvent();        
    }

    /**
     * Add eventListener on all inputs & submit form
     * @use Validation class
     * @use Form class
     * @returns {void} 
     * @memberof CustomForm
     */
    addEvent() {
        // onsubmit form
        try {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                // last verif user data before treatment
                if (Form.beforeSubmit(this.allInputs)) {
                    this.treatmentToApi(this.buildBody());
                }// else pb :
            })
        } catch (err) {
            console.error(err);
        }
        // on all form input
        try {
            this.allInputs.forEach((input, index, array) => {
                input.addEventListener('blur', (e) => {
                    Validation._getInstance().verifInput(e.target.value, index, array);
                })
                input.addEventListener('click', (e) => {
                    e.target.classList.remove('is-invalid');
                })
            })
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Build json body (contact, products)
     * @use Utils class
     * @param {Object} objContact
     * @returns {String} json body
     * @memberof CustomForm
     */
    buildBody() {
        try {
            // get from localStorage
            /** @var {null|String} */
            const basket = LocalStorage._getItem("basket");
            const productsBasketfromJSON = Utils._workWithJSON(basket, "toOBJ");
            // build body
            const contactOfBody = Utils._buildContactBody(this.allInputs);
            /** @var {Array<String>} productsOfBody all ids products */
            const productsOfBody = Utils._recomposeProductsId(productsBasketfromJSON);
            return Utils._workWithJSON({ contact: contactOfBody, products: productsOfBody }, "toJSON");
        } catch (err) {
            console.error(err);
        }
    }
    
    async treatmentToApi(body) {
        const options = {
            method: "POST",
            body: body
        }
        try {
            /** @var {Promise} ApiResponse */
            const APIResponse = await FetchData._getInstance().getData("/order", options);
            this.loadInStorage(this.keyStorage, APIResponse);            
        } catch (err) {
            console.error(err);
        }
    }

    /**
     *
     *
     * @param {String} url
     * @memberof CustomForm
     */
    redirect(url) {
        window.location.assign(url);
    }

    /**
     * Add one item in session storage
     * @use objError obj
     * @use LocalStorage class
     * @use Utils class
     * @param {String} key
     * @param {Object} data
     * @memberof CustomForm
     */
    loadInStorage(key, data) {
        if (typeof key !== 'string' || typeof data !== 'object') {
            throw Error(`${objError.type.generic}`);
        }
        try {
            const stringData = Utils._workWithJSON(data, 'toJSON');
            LocalStorage._setItem(key, stringData);
            this.redirect("/front/pages/confirmation.html");
        } catch (err) {
            console.error(err);
        }
    }
    
    /**
     * Build string of form
     * @returns {String}
     * @memberof CustomForm
     */
    createForm() {
        return `
            <form>
                <div class="form-group">
                    <label for="firstName">Nom</label>
                    <input minlength='2' required type="text" class="form-control" id="firstName">
                    <div class="invalid-feedback">Veuillez entrer un nom valide (2-20car)</div>
                </div>

                <div class="form-group">
                    <label for="lastName">Prénom</label>
                    <input minlength='2' required type="text" class="form-control" id="lastName">
                    <div class="invalid-feedback">Veuillez entrer un prénom valide (2-20car)</div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend">@</span>
                        </div>
                        <input type="email" class="form-control" id="email" required>
                        <div class="invalid-feedback">Veuillez entrer un email valide</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="address">Adresse</label>
                    <input minlength='5' required type="text" class="form-control" id="address">
                    <div class="invalid-feedback">Veuillez entrer une adresse valide (5-50car)</div>
                </div>

                <div class="form-group">
                    <label for="city">Ville</label>
                    <input minlength='2' required type="text" class="form-control" id="city">
                    <div class="invalid-feedback">Veuillez entrer une ville (2-30car)</div>
                </div>
                <button id='submit' type="submit" class="btn">Envoyer</button>
            </form>
        `;
    }
}