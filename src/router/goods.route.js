const Router = require("koa-router");

const { auth, hadAdminPermission } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/goods.middleware");

const { upload, create, update } = require("../controller/goods.controller");

const router = new Router({ prefix: "/goods" });

// 图片上传
router.post("/upload", auth, hadAdminPermission, upload);

// 发布商品
router.post("/", auth, hadAdminPermission, validator, create);

// 修改商品
router.put("/:id", auth, hadAdminPermission, validator, update);

module.exports = router;
