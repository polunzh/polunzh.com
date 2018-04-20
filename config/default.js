const path = require('path');

const ROOT_PATH = path.join(__dirname, '..');

module.exports = {
  rootPath: ROOT_PATH,
  logPath: path.join(ROOT_PATH, 'logs'),
  targetDir: path.join(ROOT_PATH, 'data'),
  repositoryName: 'Blog',
};
