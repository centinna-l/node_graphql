require("dotenv").config();

const server = require("./api/server");
const { sequelize } = require("./database/models");

const PORT = 8000;

process.on("uncaughtException", (err) => {
  console.error(`${new Date().toUTCString()} uncaughtException:`, err);
  process.exit(0);
});

process.on("unhandledRejection", (err) => {
  console.error(`${new Date().toUTCString()} unhandledRejection:`, err);
});

server.listen(PORT, async () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/api`);
  await sequelize.authenticate();
  console.log("DB Synced");
});
