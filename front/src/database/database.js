import {
  addRxPlugin,
  createRxDatabase
} from 'rxdb';

import Table from '../table/table';
import TableCollection from '../table/tableCollection';

addRxPlugin(require('pouchdb-adapter-memory'));

export default class Database {

  constructor(name) {
    this._name = name;
  }

  async init() {
    // doc for RxDb: https://rxdb.info/rx-database.html
    this._rxDb = await createRxDatabase({ name: this._name, adapter: 'memory' });
  }

  async createTable(name, keyContext, dataContext) {
    const table = new Table(name, this, keyContext, dataContext);
    await table.init();
    return table;
  }

  async createCollection(table) {
    const schema = this._createSchema(table.keyContext, table.dataContext);
    const rxDbCollection = await this._rxDb.collection({ "name": table.name, "schema": schema });
    return new TableCollection(table, rxDbCollection);
  }

  _createSchema(keyContext, dataContext) {
    const properties = this._createColumnProperties(keyContext, dataContext);

    // doc for RxDb-Schema: https://rxdb.info/rx-schema.html

    const keyColumnNames = [...keyContext];

    return {
      title: name,
      type: 'object',
      version: 0,
      properties,
      required: keyColumnNames,
      indexes: [keyColumnNames],
    };
  }

  _createColumnProperties(keyContext, dataContext) {
    const properties = {_id: {type: "string", primary: true}};
    for (let columnName of keyContext) {
      properties[columnName] = { type: 'integer' };
    }

    for (const columnName of dataContext) {
      properties[columnName] = { type: 'number' };
    }

    return properties;
  }
}
