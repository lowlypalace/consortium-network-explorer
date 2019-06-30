let Session = require("apla-blockchain-tools");
let fetch = require("node-fetch");

// login to the node
let login = async nodeUrl => {
  // default private key
  let privKey =
    "57a937b4c064ebb868c9e30620629e24a3d3cd7c1868388f21581afde74e8b2f";

  // defailt networkID
  let networkId = 1;

  let session = new Session.Session(nodeUrl, networkId, {
    privateKey: privKey
  });

  let resp = await session.login();

  return resp;
};

// getting information about the value
let getValue = async (nodeUrl, value, table, column) => {
  // default table and column names can be modified later
  table = table || "sidechain_hashes";
  column = column || "tx_hash";

  let token = await login(nodeUrl);

  let response = await fetch(`${nodeUrl}/row/${table}/${column}/${value}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  let json = await response.json();

  if (response.status >= 400 && response.status < 600) {
    throw new Error("Bad response from server");
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
