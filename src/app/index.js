const Koa = require("koa");
const KoaBody = require("koa-body");

const errHandler = require("./errHandler");

const userRouter = require("../router/user.route");

const app = new Koa();

app.use(KoaBody());
app.use(userRouter.routes());

app.on("error", errHandler);

module.exports = app;
