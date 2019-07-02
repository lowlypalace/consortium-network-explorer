"use strict";

let { Session } = require("apla-blockchain-tools");
let fetch = require("node-fetch");
let data = require("../config");

// login to the node
let login = async nodeUrl => {
  let privKey = data.network.privKey;
  let networkId = data.network.networkId;

  let session = new Session(nodeUrl, networkId, {
    privateKey: privKey
  });

  await session.login();

  if(session.err){
    throw session.err;
}

  return session.token;
};

// getting information about the value
let getValue = async (nodeUrl, value, table, column) => {
  table = data.network.table;
  column = data.network.column;

  let token = await login(nodeUrl);

  let response = await fetch(`${nodeUrl}/row/${table}/${column}/${value}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  let json = await response.json();

  if (response.status >= 400 && response.status < 600) {
    throw new Error("Bad response from server: " + response.status);
  }
  return json;
};

// checking if the node exists in the response
let checkValue = async (nodeUrl, nodeName, value) => {
  let json = await getValue(nodeUrl, value);

  let obj = JSON.parse(json.value.information);

  for (let i = 0; i < obj.nodes.length; i++) {
    if (obj.nodes[i] === nodeName) {
      return true;
    }
  }
  return false;
};

module.exports.login = login;
module.exports.getValue = getValue;
module.exports.checkValue = checkValue;
