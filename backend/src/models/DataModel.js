const fs = require('fs').promises;
const path = require('path');

class DataModel {
  constructor(filename) {
    this.filePath = path.join(__dirname, '../data', filename);
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
    }
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error);
      return false;
    }
  }

  async findById(id) {
    const data = await this.readData();
    return data.find(item => item.id === id);
  }

  async findOne(query) {
    const data = await this.readData();
    return data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async findAll(query = {}) {
    const data = await this.readData();
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async create(newItem) {
    const data = await this.readData();
    data.push(newItem);
    await this.writeData(data);
    return newItem;
  }

  async update(id, updates) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    await this.writeData(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    data.splice(index, 1);
    await this.writeData(data);
    return true;
  }
}

module.exports = DataModel;
