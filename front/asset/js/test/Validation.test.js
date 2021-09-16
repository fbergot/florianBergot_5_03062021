/**
 * @jest-environment jsdom
 */
import Validation from "../class/Validation.js";
import { objError } from "../errors/err.js";

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
        it("should throw an error because arg is empty string", function () {
            expect(() => {
                Validation._getInstance().verifInput("", '1', []);
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Validation._getInstance().verifInput("data", 0, {});
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should return true & remove class is-invalid", function () {
            // sim input
            document.body.innerHTML = `
                <input class='is-invalid' value='nameValue'>`;
            const arrayInputs = [...document.querySelectorAll('input')];
            const index = 0;
            const data = arrayInputs[0].value;
            const state = Validation._getInstance().verifInput(data, index, arrayInputs);

            expect(state).toBe(true);
            expect(arrayInputs[0].classList.contains('is-invalid')).toBe(false);
        })

        it("should return false & add class is-invalid", function () {
            // sim input
            document.body.innerHTML = `
                <input class='' value='4444'>`;
            const arrayInputs = [...document.querySelectorAll('input')];
            const index = 0;
            const data = arrayInputs[0].value;
            const state = Validation._getInstance().verifInput(data, index, arrayInputs);

            expect(state).toBe(false);
            expect(arrayInputs[0].classList.contains('is-invalid')).toBe(true);
        })

        it("should throw error because index invalid", function () {
            // sim input
            document.body.innerHTML = `
                <input class='' value='4444'>`;
            const arrayInputs = [...document.querySelectorAll('input')];
            const index = 4;
            const data = arrayInputs[0].value;
                        
            expect(() => {
                Validation._getInstance().verifInput(data, index, arrayInputs);
            }).toThrow();
        })
    })
})