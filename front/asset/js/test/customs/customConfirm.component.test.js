import CustomConfirm from "../../customConfirm.component.js";
import { objError } from "../../errors/err.js";

describe('test CustomConfirm class', function () {

    window.localStorage.setItem('responseApi', JSON.stringify({
        products: [
            {
                name: 'test',
                price: 150
            }
        ],
        orderId: "150ab"
    }));
    window.localStorage.setItem('totalPrice', '120');

    customElements.define("custom-confirm", CustomConfirm);
    document.body.innerHTML = `<custom-confirm></custom-confirm>`;
    const custom = document.querySelector("custom-confirm");
    

    describe('test getPrice()', function () {
        it('should throw an error because bad arg', function () {
            expect(() => {
              custom.getPrice("");
            }).toThrowError(`${objError.type.generic} or empty`);

            expect(() => {
              custom.getPrice(100);
            }).toThrowError(`${objError.type.generic} or empty`);
        })
        
        it('should return good price', function () {
            expect(custom.getPrice('totalPrice')).toBe('120');
        })

        it('should return "0" ', function () {
            window.localStorage.removeItem('totalPrice');
            expect(custom.getPrice("test")).toBe(false);
        })
    })

    describe('test getCommandId(key)', function () {
        it('should throw an error because bad arg', function () {
            expect(() => {
              custom.getCommandId("");
            }).toThrowError(`${objError.type.generic} or empty`);

            expect(() => {
              custom.getCommandId({});
            }).toThrowError(`${objError.type.generic} or empty`);
        })

        it('should return orderId', function () {
            expect(custom.getCommandId("responseApi")).toBe('150ab');
        })

        it('should return false', function () {
            expect(custom.getCommandId("badItem")).toBe(false);
        })
    })

    describe('test loopOnProducts(arrayProducts)', function () {
        it('should throw an error', function () {
            expect(() => {
                custom.loopOnProducts('test');
            }).toThrowError(`${objError.type.generic}`)
        })

        it('should call 2 times', function () {
            const arrayProd = [
                {
                    name: 'test'
                },
                {
                    name: 'test'    
                }
            ]
            custom.createLine = jest.fn();
            custom.loopOnProducts(arrayProd);
            expect(custom.createLine).toHaveBeenCalledTimes(2);
        })
    })
})