import Cli from './cli';
import DBService from './dbService';

const db = new DBService();

(async () => {
  const cli = new Cli();
  await cli.run();
  await db.disconnect();
})().catch((error) => {
  console.error(error);
});
