"use strict";

let {Session} = require("apla-blockchain-tools");
let fetch = require("node-fetch");
let {network} = require("../config");

// login to the node
let login = async nodeUrl => {
    let privKey = network.privKey;
    let networkId = network.networkId;

    let session = new Session(nodeUrl, networkId, {
        privateKey: privKey
    });

    await session.login();
    return session.token;
};

// getting information about the value
let getValue = async (nodeUrl, value, table, column) => {
    table = network.table;
    column = network.column;


    let token = await login(nodeUrl);

    let response = await fetch(`${nodeUrl}/row/${table}/${column}/${value}`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    //console.log(response)
    if(response.status === 200){
        return  await response.json();
    }
    if(response.status === 404){
        // there is no such row
        return {value: {status: 0}}
    }

    throw new Error("Bad response from server: " + response.status);
};

// check if confirmed
// {}
let checkValue = async (nodeUrl, valueToCheck) => {
    let res = await getValue(nodeUrl, valueToCheck);
    let status = Number.parseInt(res.value.status);
    return status === 1;
};

module.exports.checkValue = checkValue;
