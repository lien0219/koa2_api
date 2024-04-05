const { createOrUpdate, findCarts } = require("../service/cart.service");

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
  async findAll(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.query;
    const res = await findCarts(pageNum, pageSize);
    ctx.body = {
      code: 0,
      message: "获取购物车列表成功",
      result: res,
    };
  }
}

module.exports = new CartController();
