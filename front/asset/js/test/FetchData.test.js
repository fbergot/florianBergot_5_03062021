import FetchData from "../class/FetchData.js";
import { objError } from '../errors/err.js';

describe('test FetchData class', function () {
    
    describe('test _getInstance()', function () {
       it('should created an instance of FecthData class', function () {
            expect(FetchData._getInstance()).toBeInstanceOf(FetchData);
        })
        
        it('should returned true if ever same instance (singleton)', function () {
            expect(Object.is(FetchData._getInstance(), FetchData._getInstance())).toBe(true);
        })
    })

    describe('test getData(uri, objOptions)', function () {

        it('should throw an error because bad arg', function () {
            expect(() => {
                FetchData._getInstance().getData(15, {});
            }).toThrowError(`${objError.type.generic}`);

            expect(() => {
                FetchData._getInstance().getData('/', []);
            }).toThrowError(`${objError.type.generic}`);
        })
        
        const data = [
            {
                name: 'test'
            }
        ]
        

        it("should return data", async function () {
            fetch.mockResponseOnce(JSON.stringify(data));   
            expect(await FetchData._getInstance().getData('/', {})).toEqual(data);           
        })


        it("should call console.error(err)", async function () {
            fetch.mockRejectedValue({
                message: 'error message'
            })
            console.error = jest.fn();
            await FetchData._getInstance().getData("/", {});
            expect(console.error).toHaveBeenCalledWith("error message");
        })

    })
})