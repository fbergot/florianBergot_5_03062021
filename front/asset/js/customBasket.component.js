export default class CustomBasket extends HTMLElement {
    constructor() {
        super();
        // attach shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div part='containerBasket' id='internalBasketContainer'>
                <p>Votre panier est vide</p>
            </div>
            <style>
                #internalBasketContainer {
                    
                }
                </style>
            `;
    }

    connectedCallback() {

    }
}