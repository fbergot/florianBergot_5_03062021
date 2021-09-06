export default class CustomBasket extends HTMLElement {
    constructor() {
        super();
        // attach shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div part='containerBasket' id='internalBasketContainer'></div> 
            <style>
                #internalBasketContainer {
                    border: 1px solid black;
                    width: 100px;
                    height: 200px;
                }
                </style>
            `;
    }

    connectedCallback() {

    }
}