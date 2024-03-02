const Router = require("koa-router");

const {
  userValidator,
  verifyUser,
  crpytPassword,
  verifyLogin,
} = require("../middleware/user.middleware.js");
const { register, login } = require("../controller/user.controller");

const router = new Router({ prefix: "/users" });

// 注册
router.post("/register", userValidator, verifyUser, crpytPassword, register);

// 登录
router.post("/login", userValidator, verifyLogin, login);

module.exports = router;
