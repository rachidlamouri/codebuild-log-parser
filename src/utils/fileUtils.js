const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const cacheDir = 'temp';

module.exports.fileUtils = {
  cacheFile: (groupName, streamName, text) => {
    const escapedGroupName = groupName.replace(/\//g, '-');
    const groupDir = `${cacheDir}/${escapedGroupName}`;
    mkdirp.sync(groupDir);

    const filename = `${groupDir}/${streamName}`;
    fs.writeFileSync(filename, text);

    console.log(`Wrote: ${filename}`);
  },
  clearCache: () => {
    rimraf.sync(cacheDir);
  },
};
