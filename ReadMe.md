# 一.项目初始化

## 1.npm 初始化

```
npm init -y
```

## 2.git 初始化

```
git init
```

## 3.创建 ReadMe 文件

# 二.搭建项目

## 1.安装 koa

```
npm install koa
```

## 2 编写最基本的 app

创建`src/main.js`

```
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})
```

## 3 测试

在终端, 使用`node src/main.js`

# 三. 项目的基本优化

## 1 自动重启服务

安装 nodemon 工具

```
npm i nodemon -D
```

编写`package.json`脚本

```
"scripts": {
  "dev": "nodemon ./src/main.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

执行`npm run dev`启动服务

## 2 读取配置文件

安装`dotenv`, 读取根目录中的`.env`文件, 将配置写到`process.env`中

```
npm i dotenv
```

创建`.env`文件

```
APP_PORT=8000
```

创建`src/config/config.default.js`

```
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT)

module.exports = process.env
```

改写`main.js`

```
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello api'
})

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 四. 添加路由

路由: 根据不同的 URL, 调用对应处理函数

## 1 安装 koa-router

```
npm i koa-router
```

1. 导入包

2. 实例化对象

3. 编写路由

4. 注册中间件

## 2 编写路由

创建`src/router`目录, 编写`user.route.js`

```
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```

## 3 改写 main.js

```
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const userRouter = require('./router/user.route')

const app = new Koa()

app.use(userRouter.routes())

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 五. 目录结构优化

## 1 将 http 服务和 app 业务拆分

创建`src/app/index.js`

```
const Koa = require('koa')

const userRouter = require('../router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
```

改写`main.js`

```
const { APP_PORT } = require('./config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 2 将路由和控制器拆分

路由: 解析 URL, 分布给控制器对应的方法

控制器: 处理不同的业务

改写`user.route.js`

```
const Router = require('koa-router')

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

module.exports = router
```

创建`controller/user.controller.js`

```
class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 六. 解析 body

## 1 安装 koa-body

```
npm i koa-body
```

## 2 注册中间件

改写`app/index.js`

![image-20240224164820629](C:\Users\李恩\AppData\Roaming\Typora\typora-user-images\image-20240224164820629.png)

## 3 解析请求数据

改写`user.controller.js`文件

```
const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = ctx.request.body
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

## 4 拆分 service 层

service 层主要是做数据库处理

创建`src/service/user.service.js`

```
class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```

# 七. 集成 sequlize

sequelize ORM 数据库工具

ORM: 对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

## 1 安装 sequelize

```
npm i mysql2 sequelize
```

## 2 连接数据库

src/db/seq.js

```
const { Sequelize } = require('sequelize')

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
})

seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败', err)
  })

module.exports = seq
```

## 3 编写配置文件

```
APP_PORT = 8000

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root
MYSQL_PWD = 123456
MYSQL_DB = zdsc
```

# 八. 创建 User 模型

## 1 拆分 Model 层

sequelize 主要通过 Model 对应数据表

创建`src/model/user.model.js`

```
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(Model zd_user -> 表 zd_users)
const User = seq.define('zd_user', {
  // id 会被sequelize自动创建, 管理
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名, 唯一',
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码',
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员',
  },
})

// 强制同步数据库(创建数据表)
// User.sync({ force: true })

module.exports = User
```

# 九. 添加用户入库

所有数据库的操作都在 Service 层完成, Service 调用 Model 完成数据库操作

改写`src/service/user.service.js`

```
const User = require('../model/use.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // User.create({
    //   // 表的字段
    //   user_name: user_name,
    //   password: password
    // })

    // await表达式: promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }
}

module.exports = new UserService()
```

同时, 改写`user.controller.js`

```
const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 十. 错误处理

在控制器中, 对不同的错误进行处理, 返回不同的提示错误提示, 提高代码质量

```
const { createUser, getUserInfo } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body

    // 合法性
    if (!user_name || !password) {
      console.error('用户名或密码为空', ctx.request.body)
      ctx.status = 400
      ctx.body = {
        code: '10001',
        message: '用户名或密码为空',
        result: '',
      }
      return
    }
    // 合理性
    if (getUserInfo({ user_name })) {
      ctx.status = 409
      ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: '',
      }
      return
    }
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

在 service 中封装函数

```
const User = require('../model/use.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // await表达式: promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }

  async getUserInfo({ id, user_name, password, is_admin }) {
    const whereOpt = {}

    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })

    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: whereOpt,
    })

    return res ? res.dataValues : null
  }
}

module.exports = new UserService()
```

# 笔记

# 用户的认证

登录成功后, 给用户颁发一个令牌 token, 用户在以后的每一次请求中携带这个令牌.

jwt: jsonwebtoken

- header: 头部

- payload: 载荷

- signature: 签名

  

## 1 颁发 token

### 1) 安装 jsonwebtoken

```
npm i jsonwebtoken
```

### 2) 在控制器中改写 login 方法

```
async login(ctx, next) {
  const { user_name } = ctx.request.body

  // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
  try {
    // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
    const { password, ...res } = await getUerInfo({ user_name })

    ctx.body = {
      code: 0,
      message: '用户登录成功',
      result: {
        token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
      },
    }
  } catch (err) {
    console.error('用户登录失败', err)
  }
}
```

### 3) 定义私钥

在`.env`定义

```
JWT_SECRET = xzd
```

## 2 用户认证

### 1) 创建 auth 中间件

```
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config/config.default')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  console.log(token)

  try {
    // user中包含了payload的信息(id, user_name, is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的token', err)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}

module.exports = {
  auth,
}
```

### 2) 改写 router

```
// 修改密码接口
router.patch('/', auth, (ctx, next) => {
  console.log(ctx.state.user)
  ctx.body = '修改密码成功'
})
```



# 接口地址：

 http://localhost:8000

用户注册：/users/register    请求方式：post    参数："user_name":"" , "password":""

用户登录：/users/login        请求方式：post    参数："user_name":"" , "password":""

修改密码：/users/               请求方式：patch    参数：password":""

图片上传：/goods/upload    请求方式：post

发布商品：/goods           请求方式：post   

参数：{

  "goods_name":string,

  "goods_price":number,

  "goods_num":number,

  "goods_img":string

}



修改商品：/goods/{id}  请求方式：put     参数：商品id  + {

  "goods_name":string,

  "goods_price":number,

  "goods_num":number,

  "goods_img":string

}

删除商品（硬删除）：/goods/{id}    请求方式：delete    参数：商品id  （弃用）



商品下架：/goods/{id}/off     请求方式：post       参数：商品id

商品上架：/goods/{id}/on     请求方式：post       参数：商品id

获取商品列表：/goods?pageNum=1&pageSize=10  请求方式：get   参数：pageNum,pageSize



加入购物车：/carts      请求方式：post       参数：{

  "goods_id":number

}



获取购物车列表：/carts       请求方式：get        参数：pageNum,pageSize（非必填）



更新购物车:/carts/{{id}}       请求方式：patch     参数：id     +（两者其一必传：number    or  selected） {

number:number, 

selected:boolean（选中状态）

}



删除购物车：/carts       请求方式:delete           参数：{

  "ids":[1,2]，（支持多个单个删除）

}

全选&&全不选

全选：/carts/selectAll    请求方式：post     参数：无

全不选：/carts/unselectAll      请求方式：post     参数：无



添加地址：/address              请求方式：post       参数：{

  "consignee": string,    （姓名）

  "phone": string,    

  "address":string,

  "is_default":,(非必传，是否为默认地址)

}



获取地址列表：/address          请求方式：get        参数：无



修改地址:/address/{{id}}          请求方式：put       参数：id + {

  "consignee": "修改地址",

  "phone": "11222222336",

  "address": "测试测试"

}



删除地址：/address/{{id}}        请求方式：delete     参数：id（地址id）



设置默认地址：/address/{{id}}          请求方式：patch     参数：id（地址id）

 

提交订单：/orders                            请求方式：post         参数：{

  "address_id":1,

  "goods_info":"[{},{},{}]",

  "total":"199.99"

}



获取订单列表：/orders             请求方式：get                    参数：无



修改订单状态：/orders/{{id}}            请求方式：patch           参数：id（订单id）  +  {

  "status":number

}
