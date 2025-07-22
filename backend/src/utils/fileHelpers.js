const fs = require('fs').promises;
const path = require('path');

const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

const copyFile = async (source, destination) => {
  try {
    await fs.copyFile(source, destination);
    return true;
  } catch (error) {
    console.error('Error copying file:', error);
    return false;
  }
};

const getFileInfo = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    return null;
  }
};

module.exports = {
  ensureDirectoryExists,
  deleteFile,
  copyFile,
  getFileInfo
};
