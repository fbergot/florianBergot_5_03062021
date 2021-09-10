import Validation from "./class/Validation.js";

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
            this.allInputs = [...document.querySelectorAll('input')];        
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
     *
     * Add eventListener on all inputs
     * @use Validation class
     * @returns {void} 
     * @memberof CustomForm
     */
    addEvent() {
        this.allInputs.forEach((input, index, array) => {
            input.addEventListener('blur', (e) => {
                Validation._getInstance().verifInput(e.target.value, index, array);
            })
            input.addEventListener('click', function(e) {
                this.classList.remove('is-invalid');
            })
        })
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
                    <label for="name">Nom</label>
                    <input required type="text" class="form-control" id="name">
                    <div class="invalid-feedback">Veuillez entrer un nom valide (2-20car)</div>
                </div>

                <div class="form-group">
                    <label for="lastname">Prénom</label>
                    <input required type="text" class="form-control" id="lastname">
                    <div class="invalid-feedback">Veuillez entrer un prénom valide (2-20car)</div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend">@</span>
                        </div>
                        <input type="text" class="form-control" id="email" required required>
                        <div class="invalid-feedback">Veuillez entrer un email valide</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="adress">Adresse</label>
                    <input required type="text" class="form-control" id="adress">
                    <div class="invalid-feedback">Veuillez entrer une adresse valide (5-50car)</div>
                </div>

                <div class="form-group">
                    <label for="city">Ville</label>
                    <input required type="text" class="form-control" id="city">
                    <div class="invalid-feedback">Veuillez entrer une ville (2-30car)</div>
                </div>
                <button type="submit" class="btn">Envoyer</button>
            </form>
        `;
    }
}