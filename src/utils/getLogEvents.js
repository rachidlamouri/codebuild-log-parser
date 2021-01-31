const aws = require('aws-sdk');
const logs = new aws.CloudWatchLogs();

module.exports.getLogEvents = (logGroupName, logStreamName) => {
  console.log('Downloading ...')
  return logs.getLogEvents({
    logGroupName,
    logStreamName,
  })
    .promise()
    .then((response) => response.events);
};
