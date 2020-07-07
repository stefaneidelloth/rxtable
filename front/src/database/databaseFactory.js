import Database from './database';

export default class DatabaseFactory {
  async create(name) {
    const database = new Database(name);
    await database.init();
    return database;
  }
}
