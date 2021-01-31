const { Command } = require('commander');
const {
  cacheLogEvents,
  cleanCache,
  readCachedLog,
} = require('./src/commands');

const program = new Command();

program.command('cache <groupName> <streamName>')
  .usage('<groupName> <streamName>')
  .action(cacheLogEvents);

program.command('clean')
  .action(cleanCache);

program.command('read <groupName> <streamName>')
  .usage('<groupName> <streamName>')
  .action(readCachedLog);

program.parse();
