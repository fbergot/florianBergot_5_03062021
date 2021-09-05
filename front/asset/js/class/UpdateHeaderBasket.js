/**
 * Update basket in header
 * @export
 * @class UpdateHeaderBasket
 */
export default class UpdateHeaderBasket {
    /** @var {Instance of UpdateHeaderBasket | null} */
    static instance = null;
    static tagOfTarget = "#basketProduct"

    /**
     *Creates an instance of UpdateHeaderBasket.
     * @param {String} tagTargetHTML
     * @memberof UpdateHeaderBasket
     */
    constructor(tagTargetHTML) {
        this.targetHTML = document.querySelector(tagTargetHTML);
    }

    /**
     * Make unique instance of UpdateHeaderBasket (singleton)
     * @static
     * @returns
     * @memberof UpdateHeaderBasket
     */
    static _getInstance() {
        if (this.instance === null) {
            this.instance = new UpdateHeaderBasket(this.tagOfTarget);
            return this.instance;
        }
        return this.instance;
    }

    /**
     *
     *
     * @param {Number} n
     * @param {String} upOrDown
     * @returns {void}
     * @throw 
     * @memberof UpdateHeaderBasket
     */
    update(n, upOrDown) {
        // verif type of locals identifiants
        if (typeof n !== "number" || typeof upOrDown !== "string") {
            throw Error("Invalid type of parameter(s)");
        }
        // get state of basket & change state 
        let stateBasket = Number.parseInt(this.targetHTML.textContent);
        if (stateBasket < 0 || Number.isNaN(stateBasket)) {
            throw Error('Bad state of basket ');
        }
        switch (upOrDown) {
            case 'up':
                this.targetHTML.innerText = (stateBasket += n);
                break;
            case 'down':
                if (stateBasket > 0) {
                    this.targetHTML.innerText = (stateBasket -= n);
                }
                break;
            default:
                throw Error("Incorrect upOrDown parameter");
        }
    }
}