import UpdateHeaderBasket from "../class/UpdateHeaderBasket.js";
import { objError } from "../errors/err.js";

describe('test UpdateHeaderBasket class', function () {
    
    describe('test update()', function () {
        beforeEach(() => {
          window.localStorage.removeItem("basket");
        });

        it('should to inject 0 in headerBasket because not basket', function () {
            document.body.innerHTML = `
                <span id='basketProduct'></span>
            `;
            UpdateHeaderBasket._getInstance().update();
            const value = Number.parseInt(document.querySelector("#basketProduct").innerText);
            expect(value).toBe(0);
        })

        it('should to inject 4 in headerBasket', function () {
            // add basket
            const basket = {
                productsBasket : [
                    {
                        name: 'test',
                        quantity: 4
                    }
                ]
            }
            window.localStorage.setItem('basket', JSON.stringify(basket));
            UpdateHeaderBasket._getInstance().update();
            const value = Number.parseInt(document.querySelector("#basketProduct").innerText);
            expect(value).toBe(4);
        })
    })

    describe('test _getInstance()', function () {
        it('should created an instance of UpdateHeaderBasket', function () {
            expect(UpdateHeaderBasket._getInstance()).toBeInstanceOf(UpdateHeaderBasket);
        })
        
        it('should returned true if ever same instance (singleton)', function () {
            expect(Object.is(UpdateHeaderBasket._getInstance(),UpdateHeaderBasket._getInstance())).toBe(true);
        })
    })

    describe('test computeTotalInBasket(objFromJSON)', function () {
        it('should throw an error because bad arg', function () {
            expect(() => {
                UpdateHeaderBasket._getInstance().computeTotalInBasket('bad arg');
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should return total quantity of products here 6', function () {
            const basket = {
                productsBasket: [
                    {
                        name: 'test',
                        quantity: 2
                    },
                    {
                        name: 'test2',
                        quantity: 4
                    }
                ]
            }
            expect(UpdateHeaderBasket._getInstance().computeTotalInBasket(basket)).toBe(6);
        })

        it('should return NaN because missing property quantity', function () {
            const basket = {
                productsBasket: [
                    {
                        name: 'test',
                    },
                    {
                        name: 'test2',
                        quantity: 4
                    }
                ]
            }
            expect(() => {
                UpdateHeaderBasket._getInstance().computeTotalInBasket(basket)
            }).toThrowError('Missing property quantity')
        })
    })
})
