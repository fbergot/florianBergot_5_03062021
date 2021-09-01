
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
        this.headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'text/json'
        };
    }

    /**
     * Allow get unique instance of FetchData (singleton)
     * @static
     * @returns {FetchData Instance}
     * @memberof FetchData
     */
    static _getInstance() {
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
        // verifs type (objOption tested after ..)
        if (typeof uri !== 'string') {
            throw Error('Invalid type of uri parameter');
        }

        const URL = `${this.baseUri}${uri}`;
        const options = objOptions ? { ...objOptions, headers: this.headers } : { headers: this.headers };
        // call API
        const PromiseData = window.fetch(URL, options)
            .then(response => {
                if (response.ok) return response.json();
                else if (response.status >= 400) {
                    throw Error('Problem with server or connection');
                }
            })
            .then(data => data)
            .catch(err => console.error(err));
        return PromiseData;
    }
}