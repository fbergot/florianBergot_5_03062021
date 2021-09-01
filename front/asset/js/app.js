import FetchData from "./class/FetchData.js";
import Utils from "./class/Utils.js";
import UpdateHeaderBasket from "./class/UpdateHeaderBasket.js";

// juste pour tester ....
document.querySelector('#fetch').addEventListener('click', test);
document.querySelector('#inc').addEventListener('click', test2);


async function test() {
    const instance = FetchData._getInstance();
    try {
        const data = await instance.getData("/", { method: "GET" });
        console.log(data);
    } catch (err) {
        console.error(err);
    }

}

const datatest = Utils.workWithJSON({t : 'test'}, "toJSON");
console.log(datatest)


function test2() {
    try {
        const inst = new UpdateHeaderBasket("#basketProduct");
        inst.update(2, "up");
    } catch (err) {
        console.error(err);
    }
}