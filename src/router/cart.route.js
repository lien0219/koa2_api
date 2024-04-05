const Router = require("koa-router");

// 中间件
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/cart.middleware");

// 控制器
const { add, findAll, update } = require("../controller/cart.controller");

const router = new Router({ prefix: "/carts" });

// 添加购物车
router.post("/", auth, validator({ goods_id: "number" }), add);

// 获取购物车列表
router.get("/", auth, findAll);

// 更新购物车
router.patch(
  "/:id",
  auth,
  validator({
    number: { type: "number", required: false },
    selected: { type: "bool", required: false },
  }),
  update
);

module.exports = router;
