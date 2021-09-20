import CustomForm from "../../customForm.component.js";

describe('test CustomForm class', function () {
    customElements.define("custom-form", CustomForm);
    document.body.innerHTML = `<custom-form></custom-form>`;
    const custom = document.querySelector("custom-form");
    

    describe('test addEvent()', function () {
        it("should call treatmentToApi & buildBody", function () {
            custom.allInputs[0].value = 'bergot';
            custom.allInputs[1].value = 'bergot';
            custom.allInputs[2].value = 'florian.bergot564@gmail.com';
            custom.allInputs[3].value = '2 rue ter';
            custom.allInputs[4].value = 'evreux';
            // 
            custom.treatmentToApi = jest.fn();
            custom.buildBody = jest.fn();
            // submit form event
            custom.form.submit();
            expect(custom.treatmentToApi).toHaveBeenCalledTimes(1);
            expect(custom.buildBody).toHaveBeenCalledTimes(1);
        })
    })

    describe('test treatmentToApi(body)', function () {
        it("should call loadInStorage", function () {
            custom.loadInStorage = jest.fn();
            custom.treatmentToApi({});
            setTimeout(() => {
                expect(custom.loadInStorage).toHaveBeenCalledTimes(1);
            }, 100)
        })

        it("should call fetchDataInstance.getData", function () {
          custom.fetchDataInstance.getData = jest.fn();
          custom.loadInStorage = jest.fn();
          custom.treatmentToApi({});
          setTimeout(() => {
            expect(custom.fetchDataInstance.getData).toHaveBeenCalledTimes(1);
          }, 100);
        });
    })
    
})