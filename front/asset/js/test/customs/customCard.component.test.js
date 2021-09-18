import FetchData from "../../class/FetchData.js";
import CustomCard from "../../customCard.component.js";
import { objError } from '../../errors/err.js';

describe('test CustomCardElement class', function () {
    
    describe('test with data-switch = noDesc', function () {
        const data = [
            {
                name: "test",
                _id: "154",
                description: "test produit",
                imageUrl: "/image",
                lenses: ["test1", "test2"],
                price: 150,
            },
        ];

        window.fetch.mockResponseOnce(JSON.stringify(data));
        customElements.define("custom-card", CustomCard);
        document.body.innerHTML = `<custom-card data-switch='noDesc'></customCard>`;
        const custom = document.querySelector("custom-card");

        it('should be an instance of CustomCard', function () {
            expect(custom).toBeInstanceOf(CustomCard);
        })
    
        it('should be an instance of FetchData', function () {
            expect(custom.instanceFetchData).toBeInstanceOf(FetchData);
        })
        
        describe('test createCard(id, description, imageUrl, lenses, name, price)', function () {
            it('should throw an error because bad type of args', function () {
                expect(() => {
                    custom.createCard(
                        125,
                        "description test",
                        "/image",
                        ["lense1"],
                        "name test",
                        "150"
                    );
                }).toThrowError(`${objError.type.generic}`);
            })

            it('should return string', function () {
                expect(typeof custom.createCard(
                    "125",
                    "description test",
                    "/image",
                    ["lense1"],
                    "name test",
                    150
                )).toBe('string');
            })
            
        })

        describe('test getURLParam(key)', function () {
            it("should throw an error (bad arg)", function () {
                expect(() => {
                  custom.getURLParam("", "?test=1");
                }).toThrowError(`${objError.type.key}`);

                expect(() => {
                  custom.getURLParam("name", "");
                }).toThrowError(`${objError.type.key}`);
            })

            it("should return good param", function () {
                const stringParam = '?name=florian';
                    expect(custom.getURLParam('name', stringParam)).toBe("florian");
            })
        })
    })
})