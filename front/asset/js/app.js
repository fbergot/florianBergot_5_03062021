import CustomCard from './customCard.component.js';
import CustomBasket from './customBasket.component.js';
import UpdateHeaderBasket from './class/UpdateHeaderBasket.js';

// to register the customElement
window.customElements.define("custom-card", CustomCard);
window.customElements.define("custom-basket", CustomBasket);

// update headerBasket
UpdateHeaderBasket._getInstance().update();




