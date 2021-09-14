/**
 * @jest-environment jsdom
 */
import LocalStorage from "../class/LocalStorage";
import { objError } from '../errors/err';

describe("test LocalStorage class", function () {

    describe('test LocalStorage._verifIfItemExist(key)', function () {
        it("should throw an error because arg is empty string", function () {
            expect(() => {
                LocalStorage._verifIfItemExist("");
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should throw an error because bad type arg", function () {
            expect(() => {
                LocalStorage._verifIfItemExist(526);
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should return false", function () {
            expect(LocalStorage._verifIfItemExist("lol")).toBeFalsy();
        })

        it("should return true", function () {
            // add item
            window.localStorage.setItem('exist', 'exist');
            expect(LocalStorage._verifIfItemExist('exist')).toBeTruthy();
        })
    })

    describe('test LocalStorage._setItem(key, value)', function () {
        // bad arg
        it("should throw an error", function () {
            expect(() => {
                LocalStorage._setItem("", "test");
            }).toThrow();
        })

        it("should throw an error 2", function () {
            expect(() => {
                LocalStorage._setItem('test', 102);
            }).toThrowError(`${objError.type.generic} or empty`);
        })
        // test item is added
        it("should add one item in localStorage", function () {
            // if item exist -> remove
            window.localStorage.removeItem('test');
            LocalStorage._setItem("test", "test");
            expect(window.localStorage.getItem('test')).toBe('test');
        })
    })

    describe('test LocalStorage._getItem(key)', function () {

        it("should throw an error", function () {
            expect(() => {
                LocalStorage._getItem("");
            }).toThrowError(`${objError.type.generic} or null`);
        })

        it("should throw an error 2", function () {
            expect(() => {
                LocalStorage._getItem(25);
            }).toThrowError(`${objError.type.generic} or null`);
        })

        it("should to return to item in localStorage", function () {
            // add one item
            window.localStorage.setItem("key", "testing");
            expect(LocalStorage._getItem('key')).toBe("testing");
        })
    })

    describe('test LocalStorage._removeItem(key)', function () {
        // bad type of arg
        it("should throw an error because arg empty", function () {
            expect(() => {
                LocalStorage._removeItem("");
            }).toThrowError(`${objError.type.generic} or empty`)
        })

        it("should throw an error because  bad arg", function () {
            expect(() => {
                LocalStorage._removeItem([]);
            }).toThrowError(`${objError.type.generic} or empty`)
        })
        it('should erased an item', function () {
            // add item
            window.localStorage.setItem('erase', 'erase');
            const getErase = LocalStorage._getItem('erase');
            let value;
            if (getErase) {
                LocalStorage._removeItem('erase');
            }
            value = LocalStorage._getItem("erase");
            expect(value).toBeNull();
        })
    })  
})