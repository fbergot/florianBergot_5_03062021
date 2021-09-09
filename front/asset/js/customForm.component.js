export default class CustomForm extends HTMLElement {
    constructor() {
        super();
        this.innerHTML =
            `<div class='container' id='internalFormContainer'>
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
        console.log(this.allInputs);
        
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
                    <input required type="email" class="form-control is-invalid" id="name">
                    <div class="invalid-feedback">Veuillez entrer un nom</div>
                </div>

                <div class="form-group">
                    <label for="lastname">Prénom</label>
                    <input required type="text" class="form-control" id="lastname">
                    <div class="invalid-feedback">Veuillez entrer un prénom</div>
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
                    <div class="invalid-feedback">Veuillez entrer une adresse</div>
                </div>

                <div class="form-group">
                    <label for="city">Ville</label>
                    <input required type="text" class="form-control" id="city">
                    <div class="invalid-feedback">Veuillez entrer une ville</div>
                </div>
                <button type="submit" class="btn">Envoyer</button>
            </form>
        `;
    }
}