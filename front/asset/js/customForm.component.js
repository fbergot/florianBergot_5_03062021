export default class CustomForm extends HTMLElement {
    constructor() {
        super();
        // attach root of shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div part='containerForm' id='internalFormContainer'>
            </div>`;
    }
    /**
     * Called when customEl is add in DOM
     * @returns {void}
     * @memberof CustomBasket
     */
    connectedCallback() {}
}