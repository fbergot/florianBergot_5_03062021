/**
 * @jest-environment jsdom
 */
import Basket from "../class/basket.js";
import { objError } from "../errors/err.js";

describe('test Basket class', function () {
    // erase before each test
    beforeEach(() => {
        window.localStorage.removeItem('basket');
    });
   
    describe('test _getInstance()', function () {
        it('should created an instance of Basket class', function () {
            expect(Basket._getInstance()).toBeInstanceOf(Basket);
        })
        
        it('should returned true if ever same instance ', function () {
            expect(Object.is(Basket._getInstance(), Basket._getInstance())).toBe(true);
        })
    })

    describe('test createBasket(firstProduct)', function () {
        // bad arg
        it('should throw an error because bad type arg', function () {
            expect(() => {
                Basket._getInstance().createBasket("");
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Basket._getInstance().createBasket([]);
            }).toThrowError(`${objError.type.generic}`);
        })

        // create the basket
        it('should added one basket item', function () {
            Basket._getInstance().createBasket({ name: "test", quantity: 20 });
            const basket = window.localStorage.getItem("basket");
            const toObj = JSON.parse(basket);
            expect(toObj.productsBasket).toEqual([{ name: "test", quantity: 20 }]);
        })       
    })

    describe('test verifIfPresent(objFromStrJSON, product)', function () {
        // bad arg
        it("should throw an error because bad arg", function () {
            expect(() => {
                Basket._getInstance().verifIsPresent("", {});
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Basket._getInstance().verifIsPresent();
            }).toThrowError(`${objError.type.generic}`);
        })

        const obj = {
                productsBasket: [
                    {
                        name: 'test',
                        quantity: 2
                    }
                ]
            }

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
                ]
            })
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

    describe("test addInBasket()", function () {
        // test arg
        it("should throw an error because bad arg", function () {

            expect(() => {
                Basket._getInstance().addInBasket('test');
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Basket._getInstance().addInBasket();
            }).toThrowError(`${objError.type.generic}`);
        })

        // test add product
        it("should add product, case if basket exist & update headerBasket", function () {
            // add basket in localStor
            const basket = {
                productsBasket: [
    
                ]
            }
            const jsonBasket = JSON.stringify(basket);
            window.localStorage.setItem("basket", jsonBasket);
            // create fictifProd
            const product = {
                name: 'test',
                _id: '1562',
                quantity: 1
            }
            // add span in jsdom
            document.body.innerHTML = `<span id='basketProduct'></span>`;
            Basket._getInstance().addInBasket(product);
            const parse = JSON.parse(window.localStorage.getItem("basket"));

            expect(parse).toEqual({
                productsBasket: [
                    {
                        name: 'test',
                        _id: '1562',
                        quantity: 1
                    }
                ]
            })
            // test update headerBasket
            const headerBasket = document.querySelector("#basketProduct");
            expect(Number.parseInt(headerBasket.innerText)).toBe(1);
        })
    
        it("should created basket and add product", function () {
            const product = {
                _id: '154',
                quantity: 1,
                name:'test'
            }

            Basket._getInstance().addInBasket(product);
            const basketObj = JSON.parse(window.localStorage.getItem('basket'));
            // --- ! --- (call createBasket -> add {name: 'test', quantity: 20}) --- ?? ---
            expect(basketObj).toEqual({
                productsBasket: [
                    {
                        name: 'test',
                        quantity: 20
                    },
                    {
                        _id: '154',
                        quantity: 1,
                        name:'test'
                    }
                ]
            })
            // test call updateHeaderBasket
            expect(Number.parseInt(document.querySelector('#basketProduct').innerText)).toBe(21); // 20 + 1
        })
    })

    describe("test updateQuantity(productName, quantity)", function () {
        // test args
        it('should throw an error bacause bad type', function () {
            expect(() => {
                Basket._getInstance().updateQuantity(15, '');
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Basket._getInstance().updateQuantity('test', '10');
            }).toThrowError(`${objError.type.generic}`);
        })

        // test if all good
        it("should update property quantity per product", function () {
            const basketDef = {
                productsBasket: [
                    {
                        name: 'prod1',
                        quantity: 2
                    }
                ]
            }
            window.localStorage.setItem('basket', JSON.stringify(basketDef));
            Basket._getInstance().updateQuantity('prod1', 4);

            expect(JSON.parse(window.localStorage.getItem('basket'))).toEqual({
                productsBasket: [
                    {
                        name: 'prod1',
                        quantity: 4
                    }
                ]
            })
            // product not present (bad name)
            expect(() => {
                Basket._getInstance().updateQuantity("noPresent", 1);
            }).toThrowError('Product absent');
        })
    })

    describe("test findProduct(arrayProduct, productName", function () {
        const array = [
          {
            name: "test1",
          },
        ];
        // test args
        it("should throw an error because bad arg", function () {

            expect(() => {
                Basket._getInstance().findProduct({}, 'test');
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Basket._getInstance().findProduct([], 22);
            }).toThrowError(`${objError.type.generic}`);
        })
        // if ok
        it('should find product in array', function () {
            
            expect(Basket._getInstance().findProduct(array, 'test1')).toEqual(
                {
                    name: 'test1'
                }
            );
        })
        
        it('should return undefined because bad name', function () {
            expect(Basket._getInstance().findProduct(array, "badName")).toBeUndefined();
        })
    });

    describe('test findIndexProduct(arrayProduct, productName)', function () {
        const array = [
          {
            name: "test1",
          },
          {
            name: "test2",
          }
        ];

        it('should throw an error because bad arg', function () {
            expect(() => {
                Basket._getInstance().findIndexProduct({}, 'test');
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                Basket._getInstance().findIndexProduct(array, []);
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should return index of product', function () {
            expect(Basket._getInstance().findIndexProduct(array, 'test1')).toBe(0);
            expect(Basket._getInstance().findIndexProduct(array, 'test2')).toBe(1);
        })

        it("should return -1 because prod not present", function () {
            expect(Basket._getInstance().findIndexProduct(array, 'badName')).toBe(-1);
        })
    })



})