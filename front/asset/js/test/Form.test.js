import Form from "../class/Form.js";
import { objError } from '../errors/err.js';

describe('test Form class, beforeSubmit()', function () {

    it('should throw an error because bad arg', function () {
        expect(() => {
            Form._beforeSubmit([]);
        }).toThrowError(`${objError.type.generic} or array is empty`);
    })

    it("should return true", function () {
        document.body.innerHTML = `
            <input value='bergot'>
            <input value='florian'>
            <input value='florian.bergot564@gmail.com'>
            <input value='2 rue ter'>
            <input value='Evreux'>
        `;
        const arrayInputs = [...document.querySelectorAll("input")];
        expect(Form._beforeSubmit(arrayInputs)).toBe(true);
    })

    it("should return false", function () {
        document.body.innerHTML = `
            <input value='bergot'>
            <input value='florian'>
            <input value='florian.bergot564@gmail'>
            <input value='2 rue ter'>
            <input value='Evreux'>
        `;
        const arrayInputs = [...document.querySelectorAll("input")];
        expect(Form._beforeSubmit(arrayInputs)).toBe(false);
    })
})