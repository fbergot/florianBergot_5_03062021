/**
 * @jest-environment jsdom
 */
import Validation from "../class/Validation.js";

describe("test Validation class", function () {
    
    describe('test _getInstance()', function () {
        it('should created an instance of Validation class', function () {
            expect(Validation._getInstance()).toBeInstanceOf(Validation);
        })
        
        it('should returned true if ever same instance (singleton)', function () {
            expect(Object.is(Validation._getInstance(), Validation._getInstance())).toBe(true);
        })
    })

    describe('test verifInput', function () {
        it('should created an instance of Validation class', function () {
            expect(Validation._getInstance()).toBeInstanceOf(Validation);
        })
        
        it('should returned true if ever same instance (singleton)', function () {
            expect(Object.is(Validation._getInstance(), Validation._getInstance())).toBe(true);
        })

        // it("should return true & remove class is-invalid", function () {
        //     document.body.innerHTML = 
        //     // const arrayInputs;
        // })
    })
})