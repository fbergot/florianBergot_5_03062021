/**
 * Update basket in header
 * @export
 * @class UpdateHeaderBasket
 */
export default class UpdateHeaderBasket {

    static instance = null;
    static tagOfTarget = "#basketProduct"

    constructor(tagTargetHTML) {
        this.targetHTML = document.querySelector(tagTargetHTML);
    }

    static _getInstance() {
        if (this.instance === null) {
            this.instance = new UpdateHeaderBasket(this.tagOfTarget);
            return this.instance;
        }
        return this.instance;
    }

    update(n, upOrDown) {
        // verifs type
        if (typeof n !== "number" || typeof upOrDown !== "string") {
            throw Error("Invalid type of parameter(s)");
        }
        let stateBasket = Number.parseInt(this.targetHTML.textContent);
        switch (upOrDown) {
            case 'up':
                this.targetHTML.innerText = stateBasket += n;
                break;
            case 'down':
                this.targetHTML.innerText = stateBasket -= n;
                break;
            default:
                throw Error("Incorrect upOrDown parameter");
        }
    }
}