
/**
 * Allow fetch data in API
 * @singleton
 * @export
 * @class FetchData
 */
export default class FetchData {
    
    /**
     * @var {null|FetchData instance}
     */
    static instance = null;
    static baseUri = "http://localhost:3000/api/cameras";

    /**
     * Creates an instance of FetchData.
     * @param {String} baseUri
     * @memberof FetchData
     */
    constructor(baseUri) {
        this.baseUri = baseUri;
    }

    /**
     * Allow get unique instance of FetchData (singleton)
     * @static
     * @returns {FetchData Instance}
     * @memberof FetchData
     */
    static getInstance() {
        if (this.instance === null) {
            this.instance = new FetchData(this.baseUri);
            return this.instance;
        }
        return this.instance;
    }

    /**
     * Fetch data
     * @param {String} uri
     * @param {Object} objOptions
     * @returns {Promise}
     * @memberof FetchData
     */
    getData(uri, objOptions) {
        const URL = `${this.baseUri}${uri}`;
        const PromiseData = window.fetch(URL, {} || objOptions)
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.error(err));
        return PromiseData;
    }
}