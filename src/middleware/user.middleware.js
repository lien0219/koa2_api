const bcrypt = require("bcryptjs");
const { getUserInfo } = require("../service/user.service");
const {
  userFormateError,
  userAlreadyExited,
  userDoesNotExist,
  userLoginError,
  invalidPassword,
} = require("../constant/err.type");

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  // 合法性
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormateError, ctx);
    return;
  }

  await next();
};

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body;

  // if (await getUserInfo({ user_name })) {
  //   ctx.app.emit('error', userAlreadyExited, ctx)
  //   return
  // }
  try {
    const res = await getUserInfo({ user_name });

    if (res) {
      console.error("用户名已经存在", { user_name });
      ctx.app.emit("error", userAlreadyExited, ctx);
      return;
    }
  } catch (err) {
    console.error("获取用户信息错误", err);
    ctx.app.emit("error", userRegisterError, ctx);
    return;
  }

  await next();
};

// 加密中间件
const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body;

  const salt = bcrypt.genSaltSync(10);
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt);

  ctx.request.body.password = hash;

  await next();
};

// 登录验证
const verifyLogin = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;

  try {
    const res = await getUserInfo({ user_name });
    if (!res) {
      console.error("用户名不存在", { user_name });
      ctx.app.emit("error", userDoesNotExist, ctx);
      return;
    }
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit("error", invalidPassword, ctx);
      return;
    }
  } catch (error) {
    console.error(error);
    return ctx.app.emit("error", userLoginError, ctx);
  }
  await next();
};

module.exports = {
  userValidator,
  verifyUser,
  crpytPassword,
  verifyLogin,
};
