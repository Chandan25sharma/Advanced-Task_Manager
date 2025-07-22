const DataModel = require('./DataModel');
const { v4: uuidv4 } = require('uuid');

class User extends DataModel {
  constructor() {
    super('users.json');
  }

  async createUser(userData) {
    const user = {
      id: uuidv4(),
      username: userData.username,
      email: userData.email,
      password: userData.password, // Should be hashed before calling this
      role: userData.role || 'user',
      avatar: userData.avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await this.create(user);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async findByUsername(username) {
    return await this.findOne({ username });
  }

  async updateUser(id, updates) {
    updates.updatedAt = new Date().toISOString();
    return await this.update(id, updates);
  }
}

module.exports = new User();
