const { createOrUpdate } = require("../service/cart.service");

class CartController {
  async add(ctx) {
    // ctx.body = "成功";
    const user_id = ctx.state.user.id;
    const goods_id = ctx.request.body.goods_id;
    // console.log(user_id, goods_id);
    const res = await createOrUpdate(user_id, goods_id);
    ctx.body = {
      code: 0,
      message: "添加购物车成功",
      result: res,
    };
  }
}

module.exports = new CartController();
