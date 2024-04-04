const Router = require("koa-router");

const { auth, hadAdminPermission } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/goods.middleware");

const {
  upload,
  create,
  update,
  remove,
  restore,
} = require("../controller/goods.controller");

const router = new Router({ prefix: "/goods" });

// 图片上传
router.post("/upload", auth, hadAdminPermission, upload);

// 发布商品
router.post("/", auth, hadAdminPermission, validator, create);

// 修改商品
router.put("/:id", auth, hadAdminPermission, validator, update);

// 删除商品（硬删除）
// router.delete("/:id", auth, hadAdminPermission, remove);

// 商品下架
router.post("/:id/off", auth, hadAdminPermission, remove);

// 商品上架
router.post("/:id/on", auth, hadAdminPermission, restore);

module.exports = router;
