import FetchData from "./class/FetchData.js";

/**
 *
 * Custom element for create all cards with description or not 
 * @export
 * @use dataset
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
        if (this.dataset.switch === "noDesc") {
            return `<article part='card'>
                        <a part='_link' href='/front/pages/produit.html?id=${id}'>
                            <img part='productImg' src='${imageURL}'/>
                            <div part='contDescr'>
                                <p part='productTitle'>${name}</p>                                
                            </div>
                        </a>                                           
                    </article>
                    `;
            
        } else if (this.dataset.switch === "fullDesc") {
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
        }
    }

   /**
    * Fetch data for the customElement
    * @async
    * @memberof CustomCard
    */
   async connectedCallback() {        
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
        
  }
}

