/**
 * @jest-environment jsdom
 */
import Basket from "../class/basket";
import { objError } from "../errors/err";

describe('test Basket class', function () {
    
    describe('test Basket._getInstance()', function () {
        it('should created an instance of Basket class', function () {
            expect(Basket._getInstance()).toBeInstanceOf(Basket);
        })
        
        it('should returned true if ever same instance ', function () {
            expect(Object.is(Basket._getInstance(), Basket._getInstance())).toBe(true);
        })
    })

    describe('test Basket._getInstance().createBasket(firstProduct)', function () {
        // bad arg
        it('should throw an error because bad type arg', function () {
            expect(() => {
                Basket._getInstance().createBasket("");
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should throw an error because bad type arg', function () {
            expect(() => {
                Basket._getInstance().createBasket([]);
            }).toThrowError(`${objError.type.generic}`);
        })

        // create the basket
        it('should added one basket item', function () {
            // erase if item exist
            window.localStorage.removeItem('basket');
            const obj = {
                name: 'test',
                quantity: 20,
            }
            Basket._getInstance().createBasket(obj);
            const basket = window.localStorage.getItem("basket");
            const toObj = JSON.parse(basket);
            expect(toObj.productsBasket).toEqual([{ name: "test", quantity: 20 }]);
        })       
    })

    describe('test Basket._getInstance().verifIfPresent(objFromStrJSON, product)', function () {
        const obj = {
                productsBasket: [
                    {
                        name: 'test',
                        quantity: 2
                    }
                ]
            }
        // bad arg
        it("should throw an error because bad arg", function () {
            expect(() => {
                Basket._getInstance().verifIsPresent("", {});
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should throw an error because not args", function () {
            expect(() => {
                Basket._getInstance().verifIsPresent();
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should add new product", function () {
            const product = {
                name: 'test2',
                quantity: 1
            }
            Basket._getInstance().verifIsPresent(obj, product);
            expect(obj).toEqual({
                productsBasket: [
                    {
                        name: 'test',
                        quantity: 2
                    },
                    {
                        name: 'test2',
                        quantity: 1
                    }
                ]})
        })

        it("should add quantity in product", function () {
            const product = {
                name: 'test',
                quantity: 1
            }
            Basket._getInstance().verifIsPresent(obj, product);
            expect(obj).toEqual({
                productsBasket: [
                    {
                        name: 'test',
                        quantity: 3
                    },
                    {
                        name: 'test2',
                        quantity: 1
                    }
                ]})
        })

    })
})