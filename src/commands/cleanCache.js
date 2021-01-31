const { fileUtils } = require('../utils')

module.exports.cleanCache = () => {
  fileUtils.clearCache();
  console.log('Done')
  process.exit();
};
