/**
 * For mock the window.localStorage
 * @class LocalStorageMock
 */
class LocalStorageMock {
    /**
     *Creates an instance of LocalStorageMock.
     * @memberof LocalStorageMock
     */
    constructor() {
        this.store = {};
    }
    
    /**
     * clear
     * @memberof LocalStorageMock
     */
    clear() {
        this.store = {};
    }
    
    /**
     * Get an item
     * @param {String} key
     * @returns {String|null}
     * @memberof LocalStorageMock
     */
    getItem(key) {
        return this.store[key] || null;
    }
    
    /**
     * Set an item
     * @param {String} key
     * @param {String} value
     * @memberof LocalStorageMock
     */
    setItem(key, value) {
        this.store[key] = value.toString();
    }
    
    /**
     * Remove an item
     * @param {String} key
     * @memberof LocalStorageMock
     */
    removeItem(key) {
        delete this.store[key];
    }
}
// to define on global
global.defineProperty(window, "localStorage", { value: new LocalStorageMock});

