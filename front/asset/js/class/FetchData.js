import { objError } from "../errors/err.js";
/**
 * Allow fetch data in API
 * @singleton
 * @use objError 
 * @export
 * @class FetchData
 */
export default class FetchData {
    /**
     * @var {null|InstanceType<FetchData>}
     */
    static instance = null;
    static baseUri = "http://localhost:3000/api/cameras";

    /**
     * Creates an instance of FetchData.
     * @property {String} baseUri
     * @property {{'Content-Type':String, 'Accept':String}} baseUri
     * @memberof FetchData
     */
    constructor(baseUri) {
        this.baseUri = baseUri;
        this.headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'Accept': "text/json",
        };
    }

  /**
   * Allow get unique instance of FetchData (singleton)
   * @static
   * @returns {InstanceType<FetchData>}
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
   * @use objError
   * @param {String} uri
   * @param {Object} objOptions
   * @throw
   * @return {Promise}
   * @memberof FetchData
   */
    getData(uri, objOptions) {
        // verif type of locals identifiants
        if (typeof uri !== "string" || typeof objOptions !== "object" || Array.isArray(objOptions)) {
            throw Error(`${objError.type.generic}`);
        }

        const URL = `${this.baseUri}${uri}`;
        const options = { ...objOptions, headers: this.headers };
        // call API
        const PromiseData = window.fetch(URL, options)
            .then((response) => {
            if (response.ok) return response.json();
            else if (!response.ok && response.status >= 300 && response.status <= 599) {
                throw Error(
                `${objError.fetchData.invalid}, status: ${response.status}, ${response.statusText}`
                );
            }
            })
            .then((data) => data)
            .catch((err) => console.error(err.message));
        return PromiseData;
    }
}