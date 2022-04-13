require('dotenv').config();

const server = require('./api/server');

const PORT = 8000;

process.on('uncaughtException', (err) => {
  console.error(`${(new Date()).toUTCString()} uncaughtException:`, err);
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error(`${(new Date()).toUTCString()} unhandledRejection:`, err);
});


server.listen(PORT, () => console.log(
  `🚀 Server ready at http://localhost:${PORT}/api`,
));