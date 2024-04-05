const Router = require("koa-router");
const router = new Router({ prefix: "/orders" });

const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/order.middleware");

const { create } = require("../controller/order.controller");

// 提交订单
router.post(
  "/",
  auth,
  validator({
    address_id: "int",
    goods_info: "string",
    total: "string",
  }),
  create
);

module.exports = router;
