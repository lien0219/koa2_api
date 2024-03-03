const jwt = require("jsonwebtoken");

const {
  createUser,
  getUserInfo,
  updateById,
} = require("../service/user.service");

const { userRegisterError } = require("../constant/err.type");

const { JWT_SECRET } = require("../config/config.default");
class UserController {
  async register(ctx, next) {
    const { user_name, password } = ctx.request.body;

    // if (!user_name || !password) {
    //   console.error("用户名或密码为空", ctx.request.body);
    //   ctx.status = 400;
    //   ctx.body = {
    //     code: "10001",
    //     message: "用户名或密码为空",
    //     result: "",
    //   };
    //   return;
    // }

    // if (getUserInfo({ user_name })) {
    //   ctx.status = 409;
    //   ctx.body = {
    //     code: "10002",
    //     message: "用户已经存在",
    //     result: "",
    //   };
    //   return;
    // }

    try {
      const res = await createUser(user_name, password);
      // console.log(res);
      ctx.body = {
        code: 0,
        message: "用户注册成功",
        result: {
          id: res.id,
          user_name: res.user_name,
        },
      };
    } catch (error) {
      console.log(err);
      ctx.app.emit("error", userRegisterError, ctx);
    }
  }

  async login(ctx, next) {
    const { user_name } = ctx.request.body;
    // ctx.body = `欢迎回来,${user_name}`;
    try {
      const { password, ...res } = await getUserInfo({ user_name });
      ctx.body = {
        code: 0,
        message: "用户登录成功",
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: "1d" }), //失效时间一天
        },
      };
    } catch (error) {
      console.error("用户登录失败", error);
    }
  }

  async changePassword(ctx, next) {
    const id = ctx.state.user.id;
    const password = ctx.request.body.password;
    // console.log(id, password);
    if (await updateById({ id, password })) {
      ctx.body = {
        code: 0,
        message: "修改密码成功",
        result: "",
      };
    } else {
      ctx.body = {
        code: "10007",
        message: "修改密码失败",
        result: "",
      };
    }
  }
}

module.exports = new UserController();
