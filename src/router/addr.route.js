const Router = require("koa-router");

const router = new Router({ prefix: "/address" });

// 中间件&控制器
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/addr.middleware");

const { create, findAll, update } = require("../controller/addr.controller");

// 添加地址
router.post(
  "/",
  auth,
  validator({
    consignee: "string",
    phone: { type: "string", format: /^1\d{10}$/ },
    address: "string",
  }),
  create
);

// 获取地址列表
router.get("/", auth, findAll);

// 更新地址
router.put(
  "/:id",
  auth,
  validator({
    consignee: "string",
    phone: { type: "string", format: /^1\d{10}$/ },
    address: "string",
  }),
  update
);

module.exports = router;
