/**
 * @jest-environment jsdom
 */
import Utils from "../class/Utils";
import { objError } from "../errors/err";

describe('test Utils class', function () {
    
    describe('test _workWithJSON(data, vSwitch)', function () {
        // test type of return
        it('should return type string from object', function () {
            expect(typeof Utils._workWithJSON({ test: 'test' }, 'toJSON')).toBe('string');
        })
        
        it('should return type obj from valid JSON', function () {
            expect(typeof Utils._workWithJSON('{"test" : "testing"}', 'toOBJ')).toBe('object');
        })
        // test return values
        it('should return good object from valid json', function () {
            expect(Utils._workWithJSON('{"test" : "testing"}', 'toOBJ')).toEqual({test: 'testing'});
        })

        it('should return json from object', function () {
            expect(Utils._workWithJSON({ test: 'test' }, 'toJSON')).toEqual('{"test":"test"}');
        })
        
        // test args with error
        it('should return an error because bad argument vSwitch', function () {
            expect(() => {
                Utils._workWithJSON({ t: 102 }, "to");
            }).toThrowError(`${objError.utils.vSwitch}`);
        })

        it("should return an error because bad type of argument vSwitch", function () {
            expect(() => {
                Utils._workWithJSON({ t: 102 }, 105);
            }).toThrowError(`${objError.type.generic}`);
        });

        it('should return an error because bad type of argument data 2', function () {
            expect(() => {
                Utils._workWithJSON(["test"], "toOBJ");
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should return an error because not arguments', function () {
            expect(() => {
                Utils._workWithJSON();
            }).toThrowError(`${objError.type.generic}`);
        })
        // test bad argument (!string to obj & !object to string)
        it('should return an error because bad type for transformation', function () {
            expect(() => {
                Utils._workWithJSON({}, 'toOBJ');
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should return an error because bad type for transformation 2', function () {
            expect(() => {
                Utils._workWithJSON('{"test":"test"}', 'toJSON');
            }).toThrowError(`${objError.type.generic}`);
        })
    })

    describe("test _getInParamURL(paramsStr, key)", function () {
        // bad type of arguments
        it('should return an error because bad type of argument paramStr', function () {
            expect(() => {
                Utils._getInParamURL([], 'test');
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should return an error because bad type of argument key', function () {
            expect(() => {
                Utils._getInParamURL("test=2", 25);
            }).toThrowError(`${objError.type.generic}`);
        })
        // test return value
        it('should return good value', function () {
            expect(Utils._getInParamURL("test=22", 'test')).toBe("22");
        })

        it('should return null', function () {
            expect(Utils._getInParamURL("test=22", 'bad')).toBeNull();
        })
    })

    describe("test _divide(price, nDiv)", function () {
        // type of arguments
        it('should return an error', function () {
            expect(() => {
                Utils._divide('20', 15)
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should return an error', function () {
            expect(() => {
                Utils._divide(1, '15')
            }).toThrowError(`${objError.type.generic}`);
        })
        // test return value
        it('should return null', function () {
            expect(Utils._divide(0, 5)).toBeNull();
        })

        it('should return null', function () {
            expect(Utils._divide(10, 0)).toBeNull();
        })

        it('should return good result', function () {
            expect(Utils._divide(10, 2)).toBe(5);
        })
    })

    describe("test _buildContactBody(arrayInput)", function () {
        // test argument
        it('should return an error because bad type of argument', function () {
            expect(() => {
                Utils._buildContactBody(25)
            }).toThrowError(`${objError.type.generic}`);
        })
        // test missing property of elements in array
        it('should return an error because missing property', function () {
            // inputs simulation (jsdom)
            document.body.innerHTML = `
                <input value="bergot">
                <input id='lastName'>
                <input value="evreux" id='city'>
            `;
            const arrayInput = [...document.querySelectorAll('input')];
            expect(() => {
                Utils._buildContactBody(arrayInput);
            }).toThrowError(`${objError.utils.missProp}`);
        })
        // test return value
        it('should return good object', function () {
            // inputs simulation (jsdom)
            document.body.innerHTML = `
                <input value="bergot" id='firstName'>
                <input value="florian" id='lastName'>
                <input value="evreux" id='city'>
            `;
            const arrayInput = [...document.querySelectorAll('input')];
            expect(Utils._buildContactBody(arrayInput)).toEqual({firstName: 'bergot', lastName: "florian", city: "evreux"});           
        })
    })

    describe("test _recomposeProctsId({ productsBasket})", function () {
        // test type of argument
        it("should throw an error because bad type of property", function () {
            expect(() => {
                const obj = {
                    productsBasket: 'products'
                }
                Utils._recomposeProductsId(obj)
            }).toThrowError(`${objError.type.generic}`);
        })

        // test missing property
        it("should throw an error because missing property", function () {
            expect(() => {
                Utils._recomposeProductsId({})
            }).toThrowError(`${objError.type.generic}`);
        })
        it("should throw an error because missing property in element", function () {
            expect(() => {
                const obj = {
                productsBasket: [
                    {                        
                        _id: "15ab10"
                    },
                    {
                        quantity: 1,
                        _id: "tt555"
                    },
                ]
            }
                Utils._recomposeProductsId(obj)
            }).toThrowError(`${objError.utils.missProp}`);
        })
        // test all good
        it("should return good array of ids", function () {
            const obj = {
                productsBasket: [
                    {
                        quantity: 2,
                        _id: "15ab10"
                    },
                    {
                        quantity: 1,
                        _id: "tt555"
                    },
                ]
            }
            expect(Utils._recomposeProductsId(obj)).toEqual(["15ab10", "15ab10", "tt555"]);
        })
    })
})