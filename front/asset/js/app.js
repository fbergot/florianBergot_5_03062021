import FetchData from "./class/FetchData.js";

const button = document.querySelector('#fetch').addEventListener('click', test);

async function test() {

    const instance = FetchData.getInstance();
    const data = await instance.getData("/");

    console.log(data);
}
