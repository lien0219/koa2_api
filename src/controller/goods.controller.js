const path = require("path");

const {
  fileUploadError,
  unSupportedFileType,
  publishGoodsError,
  invalidGoodsID,
} = require("../constant/err.type");

const {
  createGoods,
  updateGoods,
  removeGoods,
  restoreGoods,
  findGoods,
} = require("../service/goods.service");

class GoodsController {
  async upload(ctx, next) {
    const { file } = ctx.request.files;

    const fileTypes = ["image/jpeg", "image/png"];
    if (file) {
      if (!fileTypes.includes(file.type)) {
        return ctx.app.emit("error", unSupportedFileType, ctx);
      }
      ctx.body = {
        code: 0,
        message: "商品图片上传成功",
        result: {
          goods_img: path.basename(file.path),
        },
      };
    } else {
      return ctx.app.emit("error", fileUploadError, ctx);
    }
  }

  async create(ctx) {
    try {
      const { createdAt, updatedAt, ...res } = await createGoods(
        ctx.request.body
      );
      ctx.body = {
        code: 0,
        message: "发布商品成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", publishGoodsError, ctx);
    }
  }

  async update(ctx) {
    // ctx.body = "修改成功";
    const res = await updateGoods(ctx.params.id, ctx.request.body);
    if (res) {
      ctx.body = {
        code: 0,
        message: "修改商品成功",
        result: "",
      };
    } else {
      return ctx.app.emit("error", invalidGoodsID, ctx);
    }

    try {
    } catch (err) {
      console.error(err);
    }
  }

  async remove(ctx) {
    // ctx.body = "删除成功";
    try {
      const res = await removeGoods(ctx.params.id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "下架商品成功",
          result: "",
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async restore(ctx) {
    try {
      const res = await restoreGoods(ctx.params.id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "上架商品成功",
          result: "",
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async findAll(ctx) {
    // 1. 解析pageNum和pageSize
    const { pageNum = 1, pageSize = 10 } = ctx.request.query;
    // 2. 调用数据处理的相关方法
    const res = await findGoods(pageNum, pageSize);
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: "获取商品列表成功",
      result: res,
    };
  }
}

module.exports = new GoodsController();
