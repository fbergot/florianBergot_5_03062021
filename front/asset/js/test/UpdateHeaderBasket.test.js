import UpdateHeaderBasket from "../class/UpdateHeaderBasket.js";
import { objError } from "../class/UpdateHeaderBasket.js";

describe('test UpdateHeaderBasket class', function () {
    describe('test _getInstance()', function () {
        it('should created an instance of UpdateHeaderBasket', function () {
            expect(UpdateHeaderBasket._getInstance()).toBeInstanceOf(UpdateHeaderBasket);
        })
        
        it('should returned true if ever same instance (singleton)', function () {
            expect(Object.is(UpdateHeaderBasket._getInstance(),UpdateHeaderBasket._getInstance())).toBe(true);
        })
    })
})
