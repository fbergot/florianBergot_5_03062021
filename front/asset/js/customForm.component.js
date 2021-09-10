import Form from "./class/Form.js";
import Validation from "./class/Validation.js";
import Utils from "./class/Utils.js";

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
                const stateForm = Form.beforeSubmit(this.allInputs);
                if (stateForm) {
                    const body = Utils._buildQueryBody(this.allInputs);
                    console.log(body);
                    // after, call api with his body..
                }
            })
        } catch (err) {
            console.error(err);
        }
        // on all input
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
     * Build bootstrap form
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