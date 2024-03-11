const path = require("path");

const Koa = require("koa");
const KoaBody = require("koa-body");
const KoaStatic = require("koa-static");

const errHandler = require("./errHandler");

// const userRouter = require("../router/user.route");

// const goodsRouter = require("../router/goods.route");
const router = require("../router");

const app = new Koa();

app.use(
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "../upload"),
      keepExtensions: true,
    },
  })
);
app.use(KoaStatic(path.join(__dirname, "../upload")));
// app.use(userRouter.routes());
// app.use(goodsRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", errHandler);

module.exports = app;
