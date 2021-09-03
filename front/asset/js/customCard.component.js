import FetchData from "./class/FetchData.js";
import Utils from "./class/Utils.js";

/**
 *
 * Custom element for create all cards with description or not 
 * @export
 * @use dataset
 * @use FetchData class
 * @use Utils class
 * @class CustomCard
 * @extends {HTMLElement}
 */
export default class CustomCard extends HTMLElement {
    // getters & setter here..

    /**
     *Creates an instance of CustomCard.
    * @memberof CustomCard
    */
    constructor() {
        super();
        this.data;
        this.totalCards = "";
        // shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `              
            <div part='container' id='internalCardContainer'>              
            </div>           
        `;
    }

    /**
     * Create the card with good data
     * @use dataset for switch (fullDescr or card noDescr)
     * @param {String} id
     * @param {String} description
     * @param {String} imageURL
     * @param {Array<String>} lenses
     * @param {String} name
     * @param {Number} price
     * @returns {String} card
     * @throw  
     * @memberof CustomCard
     */
    createCard(id, description, imageURL, lenses, name, price) {
      // verif type of locals identifiants
        if (typeof id !== "string" || typeof description !== "string" ||
            typeof imageURL !== 'string' || !Array.isArray(lenses) ||
            typeof name !== 'string' || typeof price !== 'number') {
            throw Error('Invalid type(s) of parameter(s)');
        }       
        if (lenses.length === 0) {
            throw Error('the length of parameter lenses(Array) is 0');
        }
        // create options for lens select
        let strOptionLens = "";
        let lensCreateOptions;    
        lensCreateOptions = lenses.map((lens, index) => {
            return `<option value='${index}'>${lens}</option>`;
        });
        
        lensCreateOptions.forEach(element => {
            strOptionLens += element;
        })
          
        // switch with data-attr (dataset)
        switch (this.dataset.switch) {
            case 'noDesc':
                return `<article part='card'>
                            <a part='_link' href='/front/pages/produit.html?id=${id}'>
                                <img part='productImg' src='${imageURL}'/>
                                <div part='contDescr'>
                                    <p part='productTitle'>${name}</p>                                
                                </div>
                            </a>                                           
                        </article>
                        `;
            case 'fullDesc':
                return `<article part='cardFull'>
                            <a part='_linkFull' href='/front/pages/produit.html?id=${id}'>
                                <img part='productImgFull' src='${imageURL}'/>
                                      <div part='contDescrFull'>
                                    <h2 part='productTitleFull'>${name}</h2>
                                    <p part='productDescrFull'>${description}</p>
                                </div>
                            </a>
                            <div part='productContPriceFull'>
                                <select part='productSelectFull' name='lens' id='lens'>
                                    <option value="">Lentilles</option>
                                    ${strOptionLens}
                                </select>
                                <p part='productPriceFull'>${price}€</p>
                            </div>
                                
                        </article>
                        `;
            default:
                throw Error('Invalid data-attr for custom-card (accepted: noDesc or fullDesc)');
        }
    }

    /**
     * Get also string of URL params
     * @use Utils class
     * @param {String} key
     * @throw 
     * @returns {String}
     * @memberof CustomCard
     */
    getIdURLParam(key) {
        if (typeof key !== 'string') {
            throw Error("Key parameter is invalid");
        }
        const urlString = window.location.search;
        const paramsAlso = urlString.replace('?', '');
        return Utils.getInParamURL(paramsAlso, key);       
    }

   /**
    * Fetch data for the customElement
    * @async
    * @use FetchData class
    * @memberof CustomCard
    */
    async connectedCallback() {
        switch (this.dataset.switch) {
            case 'noDesc':
                        try {
                            this.instance = FetchData._getInstance();
                            this.data = await this.instance.getData("/", { method: "GET" });
                            this.data.forEach(elem => {
                                this.totalCards += this.createCard(elem._id, elem.description, elem.imageUrl, elem.lenses, elem.name, elem.price);
                            })
                            this.shadowRoot.querySelector('#internalCardContainer').innerHTML = this.totalCards;
                        } catch (err) {
                            console.error(err);
                        }
                        break;
            case 'fullDesc':
                    try {
                        const id = this.getIdURLParam('id');
                        this.instance = FetchData._getInstance();
                        this.dataObj = await this.instance.getData(`/${id}`, { method: "GET" });
                        this.data = [this.dataObj];
                        this.data.forEach(elem => {
                            this.totalCards += this.createCard(elem._id, elem.description, elem.imageUrl, elem.lenses, elem.name, elem.price);
                        })
                        this.shadowRoot.querySelector('#internalCardContainer').innerHTML = this.totalCards;
                    } catch (err) {
                        console.error(err);
                    }
                    break;
            default:
                throw Error('Invalid data-attr for custom-card (accepted: noDesc or fullDesc)');
        }        
    }
}

