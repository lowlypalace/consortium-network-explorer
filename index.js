const express = require("express");

let bodyParser = require("body-parser");
let lib = require("./lib");
let data = require("./config");

const app = express();
const port = 3000;

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/src"));

//get requests
app.get("/", (req, res) => res.render("index"));

//post requests
app.post("/", urlencodedParser, async (req, res) => {
  let value = req.body.value;

  let result = await Promise.all(
    data.map(async currentObject => {
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

  res.render("list", { value: value, result: result });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
