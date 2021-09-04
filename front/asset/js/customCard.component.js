import { objError } from "./errors/err.js";
import FetchData from "./class/FetchData.js";
import Utils from "./class/Utils.js";
import Basket from "./class/basket.js";
/**
 *
 * Custom element for create all cards with description or not 
 * @export
 * @use dataset
 * @use objError obj
 * @use FetchData class
 * @use Basket class
 * @use Utils class
 * @class CustomCard
 * @extends {HTMLElement}
 */
export default class CustomCard extends HTMLElement {
    /**
    *Creates an instance of CustomCard.
    * @memberof CustomCard
    */
    constructor() {
        super();
        this.data = null;
        this.instance = null;
        this.totalCards = "";
        // attach shadow DOM
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML =
            `<div part='container' id='internalCardContainer'></div> `;
    }

    /**
     * Create the card with good data
     * @use dataset for switch (fullDescr or card noDescr)
     * @use objError
     * @param {String} id
     * @param {String} description
     * @param {String} imageURL
     * @param {Array<String>} lenses
     * @param {String} name
     * @param {Number} price
     * @throw  
     * @returns {String} card
     * @memberof CustomCard
     */
    createCard(id, description, imageURL, lenses, name, price) {
      // verif type of locals identifiants
        if (typeof id !== "string" || typeof description !== "string" ||
            typeof imageURL !== 'string' || !Array.isArray(lenses) ||
            typeof name !== 'string' || typeof price !== 'number') {
            throw Error(`${objError.type.generic}`);
        }       
        if (lenses.length === 0) {
            throw Error(`${objError.length}`);
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
          
        // switch with data-attr
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
                            <div part='contBut'><button class='basketBut' part='addBasket'>Ajouter au panier</button></div>
                            <img part='productImgFull' src='${imageURL}'/>
                            <div part='contDescrFull'>
                                <h2 part='productTitleFull'>${name}</h2>
                                <p part='productDescrFull'>${description}</p>
                            </div>                            
                            <div part='productContPriceFull'>
                                <select part='productSelectFull' name='lens' id='lens'>
                                    <option value="">Lentilles disponibles</option>
                                    ${strOptionLens}
                                </select>
                                <p part='productPriceFull'>${Utils.divide(price, 100)}€</p>
                            </div>                                
                        </article>`;
            default:
                throw Error(`${objError.type.customElement}`);
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
    getURLParam(key) {
        if (typeof key !== 'string' || key === "") {
            throw Error(`${objError.type.key}`);
        }
        // get URL string
        const urlString = window.location.search;
        const paramsAlso = urlString.replace('?', '');
        return Utils.getInParamURL(paramsAlso, key);       
    }

   /**
    * Fetch data for the customElement
    * @async
    * @use FetchData class
    * @use dataset (data-attr)
    * @use Basket class
    * @throw
    * @returns {none}
    * @memberof CustomCard
    */
    async connectedCallback() {
        // switch with data-attr
        switch (this.dataset.switch) {
            case 'noDesc':
                try {
                    this.data = await this.reFactorize('/');
                    this.mapResult();
                    // add in shadow dom
                    this.render();
                } catch (err) {
                    console.error(err);
                }
                break;
            case 'fullDesc':
                try {
                    // get id parameter in URL
                    const id = this.getURLParam('id');
                    const objData = await this.reFactorize(`/${id}`);
                    this.data = [objData];
                    this.mapResult();
                    // add in shadow dom
                    this.render();
                    this.shadowRoot.querySelector('button').addEventListener('click', (e) => {
                            Basket.addInBasket(objData);
                        },{useCapture: false});
                } catch (err) {
                    console.error(err);
                }
                break;
            default:
                throw Error(`${objError.type.customElement}`);
            }                   
    }

    /**
     *
     * @use FetchData class
     * @param {String} uri
     * @throw
     * @returns {Promise}
     * @memberof CustomCard
     */
    reFactorize(uri) {
        if (typeof uri !== 'string' || uri === "") {
            throw Error(`${objError.type.generic}`);
        }       
        this.instance = FetchData._getInstance();
        return this.instance.getData(uri, { method: "GET" })
    }

    /**
     * Map on the result for create the card(s)
     * @return {none}
     * @memberof CustomCard
     */
    mapResult() {
        this.data.forEach(elem => {
            this.totalCards += this.createCard(elem._id, elem.description, elem.imageUrl, elem.lenses, elem.name, elem.price);
        })
    }

    /**
     * insert data in #internalCardContainer (root)
     * @return {none}
     * @memberof CustomCard
     */
    render() {
        this.shadowRoot.querySelector('#internalCardContainer').innerHTML = this.totalCards;
    }
}

