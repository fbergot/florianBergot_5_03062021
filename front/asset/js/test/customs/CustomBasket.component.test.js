import Basket from "../../class/basket.js";
import CustomBasket from "../../customBasket.component.js";
import { objError } from "../../errors/err.js";

describe('test CustomBasket class', function () {
    window.localStorage.setItem('basket', JSON.stringify({
        productsBasket: [
            {
                name: 'test',
                quantity: 2,
                _id: '12ab',
                imageUrl: '/image',
                price: 150
            }
        ]
    }))
    document.body.innerHTML = `
        <div id='contFormHidden'></div>
    `;
    customElements.define("custom-basket", CustomBasket);
    document.body.innerHTML += `<custom-basket></custom-basket>`;
    const custom = document.querySelector("custom-basket");
    
    describe('test computeSubTotal(quantity, price)', function () {
        
        it("should throw an error because bad args", function () {
            expect(() => {
                custom.computeSubtotal('r', 0);
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                custom.computeSubtotal(2, '0');
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should return good value", function () {
            expect(custom.computeSubtotal(5, 2)).toBe(10);
            expect(custom.computeSubtotal(4, 2)).toBe(8);
        })
    })

    describe('test createLineOfData(item)', function () {
        const item = {
            quantity: 2,
            price: 150,
            imageUrl: '/image',

        }

        it('should throw an error because bad arg', function () {
            expect(() => {
                custom.createLineOfData([]);
            }).toThrowError(`${objError.type.generic}`);
        })

        it("should call console.error because missing prop", function () {
            console.error = jest.fn();
            custom.createLineOfData({price: 100, imageUrl: '/test', name: 'test' });
            expect(console.error).toBeCalledWith('Missing property');
        })

        it('should return good value and array allSubTotal must not be empty', function () {
            expect(typeof custom.createLineOfData(item)).toBe('string');
        })
    })

    describe('test loopOnBasket(arrayProducts)', function () {
        const arrayProducts = [
                {
                    name: 'item1'
                },
                {
                    name: 'item2'
                },
                {
                    name: 'item3'
                }
        ]
        
        it("should throw an error becasue bad arg", function () {
            expect(() => {
                custom.loopOnBasket({});
            }).toThrowError(`${objError.type.generic}`);
        })

        it('should call console.error', function () {
            console.error = jest.fn();
            custom.loopOnBasket(arrayProducts);
            expect(console.error).toBeCalled();
        })

        it('should be called 3 times', function () {                               
            custom.createLineOfData = jest.fn();
            custom.loopOnBasket(arrayProducts);
            expect(custom.createLineOfData).toHaveBeenCalledTimes(3);
        })
    })
    
    describe('test addInputsEvent(inputs)', function () {
        it('should throw an error', function () {
            expect(() => {
                custom.addInputEvent([]);
            }).toThrowError(`${objError.type.generic} or length 0`);
        })

        // it("should called 2 times", function () {
        //     document.body.innerHTML = `
        //     <input data-product='test' value='2'>
        //     <input value='1'>
        //     `
        //     jest.spyOn(Basket._getInstance(), 'updateQuantity');
        //     custom.addInputEvent([...document.querySelectorAll('input')]);
            
        //     expect(Basket._getInstance().updateQuantity).toHaveBeenCalledTimes(2);
        // });
    })

    
})