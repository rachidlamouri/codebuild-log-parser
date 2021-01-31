const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const cacheDir = 'temp';

const getPaths = (groupName, streamName) => {
  const escapedGroupName = groupName.replace(/\//g, '-');
  const groupDir = `${cacheDir}/${escapedGroupName}`;
  const filepath = `${groupDir}/${streamName}.txt`;

  return {
    groupDir,
    filepath,
  };
};

module.exports.fileUtils = {
  cacheFile: (groupName, streamName, text) => {
    const { groupDir, filepath } = getPaths(groupName, streamName);
    mkdirp.sync(groupDir);
    fs.writeFileSync(filepath, text);

    console.log(`Wrote: ./${filepath}`);
  },
  clearCache: () => {
    rimraf.sync(cacheDir);
  },
  readFile: (groupName, streamName) => {
    const { filepath } = getPaths(groupName, streamName);

    return fs.readFileSync(filepath, 'utf8');
  },
};
