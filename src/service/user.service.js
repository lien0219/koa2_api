class UserService {
  async createUser(user_name, password) {
    return "写入数据库成功";
  }
}

module.exports = new UserService();
