module.exports.logger = {
  logAndExit: (error) => {
    console.log(error);
    process.exit(1);
  },
};
