const Koa = require("koa");
const KoaBody = require("koa-body");

const errHandler = require("./errHandler");

// const userRouter = require("../router/user.route");

// const goodsRouter = require("../router/goods.route");
const router = require("../router");

const app = new Koa();

app.use(KoaBody());
// app.use(userRouter.routes());
// app.use(goodsRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", errHandler);

module.exports = app;
