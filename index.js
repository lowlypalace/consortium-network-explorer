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
            ctx.response.status = 500;
            ctx.response.body = {"err": true, "message": "Error occurred while it was processing"}
        }
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve({
        rootDir: "public"
    }));


render(app, {
    root: path.join(__dirname, 'views'),
    viewExt: 'ejs',
    cache: false,
    debug: false,
    layout: false
});


//get requests, serves index.js page
router.get("/", async (ctx) => {
    let {ids} = ctx.request.query;

    if(!ids){
        await ctx.render("index", {result: []});
        return;
    }
    ids = ids.split(",");
    let result = [];
    for (let id of ids){
        let txResult = await Promise.all(nodes.map(async (node) => {
            let {nodeName, nodeUrl} = node;
            try {
                return {
                    "nodeName": nodeName,
                    "nodeStatus": await checkValue(nodeUrl, id)
                }
            }catch (e) {
                return {
                    "nodeName": nodeName,
                    "error": "Not Available"
                }
            }
        }));
        result.push({
            txHash: id,
            txResult
        })
    }
    await ctx.render("index", {result});
});

app.listen(port, () => console.log(`App listening on port ${port}`));
