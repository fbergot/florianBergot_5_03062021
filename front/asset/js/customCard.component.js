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
        /**@property {Instance of FetchdATE|null} instanceFetchData */
        this.instanceFetchData = null;
        this.totalCards = "";
        this.innerHTML = `<div class='row' id='internalCardContainer'></div> `;
    }

    /**
     * Create the card with good data
     * @use dataset for switch (fullDescr or noDescr)
     * @use objError
     * @use Utils static class
     * @param {String} id
     * @param {String} description
     * @param {String} imageURL
     * @param {Array<String>} lenses
     * @param {String} name
     * @param {Number} price
     * @throw  
     * @returns {String} (card)
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
        const lensCreateOptions = lenses.map((lens, index) => {
            return `<option value='${index}'>${lens}</option>`;
        });   
               
        lensCreateOptions.forEach(option => {
            strOptionLens += option;
        })
        
        // switch with data-attr
        switch (this.dataset.switch) {
            case 'noDesc':
                return `<article class="card nodesc col-md-6">
                            <a href='/front/pages/produit.html?id=${id}'>
                                <img class="card-img-top" src='${imageURL}'/>
                                <div class="card-body">
                                    <p class="card-title">${name}</p>                                
                                </div>
                            </a>                                           
                        </article>`;
            case 'fullDesc':
                try {
                    /**@var {Number} valuePrice */
                    var valuePrice = Utils._divide(price, 100);
                } catch (err) {
                    console.error(err);
                }
                return `<article class="card desc col-md-12">
                            <img class="card-img-top" src='${imageURL}'/>
                            <div class="card-body"'>
                                <h2 class="card-title">${name}</h2>
                                <p class="card-text">${description}</p>
                                <div class='d-flex justify-content-between align-items-center'>
                                    <select name='lens' id='lens'>
                                        <option value="">Options</option>
                                        ${strOptionLens}
                                    </select>
                                    <p class='mt-3'><strong>${valuePrice}€</strong></p>
                                </div>
                                <div class='d-flex justify-content-center mt-4'>
                                    <button class='basketBut btn btn-success text-center'>Ajouter au panier</button>
                                </div>
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
    getURLParam(key, urlStringParam) {
        if ((typeof key !== 'string' || key === "") || (typeof urlStringParam !== 'string' || urlStringParam === "")) {
            throw Error(`${objError.type.key}`);
        }
        const paramsAlso = urlStringParam.replace('?', '');
        try {
            /** @var {String} paramURL */
            var paramURL = Utils._getInParamURL(paramsAlso, key);
        } catch (err) {
            console.error(err);
        }
        return paramURL;       
    }

   /**
    * Called when customElem is add in DOM
    * @async
    * @use FetchData class
    * @use dataset (data-attr)
    * @use Basket class
    * @throw
    * @return {void}
    * @memberof CustomCard
    */
   async connectedCallback() {      
       // switch with data-attr
       switch (this.dataset.switch) {
           case 'noDesc':
               try {
                    // Fetch data for the customElement
                    this.data = await this.reFactorize("/", { method: "GET" });
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
                    const id = this.getURLParam('id', window.location.search);
                    // Fetch data & add quantity property
                    const objData = await this.reFactorize(`/${id}`, { method: "GET" });
                    objData.quantity = 1;
                    this.data = [objData];
                    // create all cards
                    this.mapResult();
                    // add in shadow dom
                    this.render();
                    this.querySelector('.basketBut').addEventListener('click', (e) => {
                        Basket._getInstance().addInBasket(objData);
                    }, false);
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
     * @return {Promise}
     * @memberof CustomCard
     */
    reFactorize(uri, options) {
        if (typeof uri !== 'string' || uri === "") {
            throw Error(`${objError.type.generic}`);
        }
        try {
            this.instanceFetchData = FetchData._getInstance();
            /** @var {Promise} */
            var data = this.instanceFetchData.getData(uri, options);
        } catch (err) {
            console.error(err);
        }
        return data;
    }

    /**
     * Map on the result for create the card(s)
     * @return {void}
     * @memberof CustomCard
     */
    mapResult() {
        this.data.forEach(elem => {
            this.totalCards += this.createCard(elem._id, elem.description, elem.imageUrl, elem.lenses, elem.name, elem.price);
        })
    }

    /**
     * insert data in #internalCardContainer
     * @return {void}
     * @memberof CustomCard
     */
    render() {
        this.querySelector('#internalCardContainer').innerHTML = this.totalCards;
    }
}

