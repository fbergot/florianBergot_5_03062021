import CustomCard from './customCard.component.js';
import CustomBasket from './customBasket.component.js';
import CustomForm from './customForm.component.js';
import CustomConfirm from './customConfirm.component.js';
import UpdateHeaderBasket from './class/UpdateHeaderBasket.js';

// to register customElements
window.customElements.define("custom-card", CustomCard);
window.customElements.define("custom-basket", CustomBasket);
window.customElements.define("custom-form", CustomForm);
window.customElements.define("custom-confirm", CustomConfirm);

// update headerBasket
UpdateHeaderBasket._getInstance().update();




