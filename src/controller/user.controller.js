const { createUser, getUserInfo } = require("../service/user.service");

const { userRegisterError } = require("../constant/err.type");
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
    ctx.body = `欢迎回来,${user_name}`;
  }
}

module.exports = new UserController();
