const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require('koa-body');
const serve = require('koa-static-server');
const render = require("koa-ejs");
const path = require("path");


let {checkValue} = require("./lib");
let {nodes, port} = require("./config");


const app = new Koa();
const router = new Router();


// error handling
app
    .use(bodyParser())
    .use(async (ctx, next) => {
        try {
            await next()
        } catch (err) {
            console.err(err);
            ctx.response.status = 500;
            ctx.response.body = {"err": true, "message": "Error occurred while it was processing"}
        }
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve({
        rootDir: "src"
    }));


render(app, {
    root: path.join(__dirname, 'views'),
    viewExt: 'ejs',
    cache: false,
    debug: false,
    layout: false
});


//get requests, serves index.js page
router.get("/", async (ctx) => ctx.render("index", {layout: false}));

//post requests, serves list.js page
router.post("/", async (ctx) => {
    let valueToCheck = ctx.request.body.value;

    let result = await Promise.all(nodes.map(async (node) => {
        let {nodeName, nodeUrl} = node;
        try {
            return {
                "nodeName": nodeName,
                "nodeStatus": await checkValue(nodeUrl, valueToCheck)
            }
        }catch (e) {
            return {
                "nodeName": nodeName,
                "error": "Not Available"
            }
        }

    }));
    //console.log(result);
    await ctx.render("list", {value: valueToCheck, result: result});
});

app.listen(port, () => console.log(`App listening on port ${port}`));
