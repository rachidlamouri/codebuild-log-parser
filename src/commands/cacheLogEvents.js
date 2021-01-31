const {
  getLogEvents,
  fileUtils,
  logger,
  parseEvents,
} = require('../utils')

module.exports.cacheLogEvents = (groupName, streamName) => {
  getLogEvents(groupName, streamName)
    .then(parseEvents)
    .then((events) => fileUtils.cacheFile(groupName, streamName, events))
    .catch(logger.logAndExit)
    .finally(() => {
      process.exit();
    })
};
