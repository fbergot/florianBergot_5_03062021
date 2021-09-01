import FetchData from "./class/FetchData.js";
import Utils from "./class/Utils.js";
import UpdateHeaderBasket from "./class/UpdateHeaderBasket.js";

document.querySelector('#fetch').addEventListener('click', test);
document.querySelector('#inc').addEventListener('click', test2);

// juste pour tester ....

async function test() {

    const instance = FetchData._getInstance();
    const data = await instance.getData("/", { method: "GET" });

    console.log(data);
}

const datatest = Utils.workWithJSON({t : 'test'}, "toJSON");
console.log(datatest)


function test2() {
    const inst = new UpdateHeaderBasket("#basketProduct");
    inst.update(2, "up");
}