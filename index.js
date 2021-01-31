const { Command } = require('commander');
const {
  cacheLogEvents,
  cleanCache,
  parseCachedLog,
} = require('./src/commands');

const program = new Command();

program.command('cache <groupName> <streamName>')
  .usage('<groupName> <streamName>')
  .action(cacheLogEvents);

program.command('clean')
  .action(cleanCache);

program.command('parse <groupName> <streamName>')
  .usage('<groupName> <streamName>')
  .action(parseCachedLog);

program.parse();
