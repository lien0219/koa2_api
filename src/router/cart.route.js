const Router = require("koa-router");

// 中间件
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/cart.middleware");

// 控制器
const { add } = require("../controller/cart.controller");

const router = new Router({ prefix: "/carts" });

router.post("/", auth, validator, add);

module.exports = router;
