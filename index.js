const express = require("express");

let bodyParser = require("body-parser");
let asyncMiddleware = require('./utils/asyncMiddleware');
let lib = require("./lib");
let data = require("./config");

const app = express();
const port = data.node_port;

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// setting ejs as a template engine
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/src"));

//get requests, serves index.js page
app.get("/", (req, res) => res.render("index"));

//post requests, serves list.js page
app.post("/", urlencodedParser, asyncMiddleware(async (req, res, next) => {
  let value = req.body.value;

  let result = await Promise.all(
    data.nodes.map(async currentObject => {
      return {
        nodeName: currentObject.nodeName,
        nodeStatus: await lib.checkValue(
          currentObject.nodeUrl,
          currentObject.nodeName,
          value
        )
      };
    })
  );

  res.render("list", { value, result });
}));

app.listen(port, () => console.log(`App listening on port ${port}`));
