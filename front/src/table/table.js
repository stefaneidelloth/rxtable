export default class Table {

  constructor(name, database, keyContext, dataContext) {
    this._name = name;
    this._database = database;
    this._keyContext = keyContext;
    this._keyMap = {};
    this._dataContext = dataContext;
    this._collection = undefined;
  }

  get database() {
    return this._database;
  }

  get dataContext() {
    return this._dataContext;
  }

  get keyContext() {
    return this._keyContext;
  }

  get name() {
    return this._name;
  }

  get valueContext() {
    return this._valueContext;
  }

  async init() {
    this._collection = await this._database.createCollection(this);
  }

  [Symbol.iterator]() {
    return this._collection[Symbol.iterator]();
  }

  pipe(...tableOperators){

    let table = this;

    let promise = new Promise(async (resolve) =>{
      for (let tableOperator of tableOperators){
       table = await this._subscribeOperator(tableOperator, table);
      }
      resolve(table);
    });

    promise.subscribe = (subscriber)=>{
      promise.then(resultTable=>{
        resultTable.subscribe(subscriber);
      })
    };

    return promise;
  }

  async push(rowValues) {
    return await this._collection.insert(rowValues);
  }

  subscribe(tableSubscriber) {
    return this._collection.subscribe(tableSubscriber);
  }

  async update(newRowValues) {
    await this._collection.update(newRowValues);
  }

  createKey(rowValues){
    return this.keyContext.map(keyColumnName=>rowValues[keyColumnName]);
  }

  createRow(rowValues){
    rowData.table = this;
    return rowData;
  }

  async row(key) {
    return await this._collection.row(key);
  }

  async _subscribeOperator(tableOperator, sourceTable){
    const database = sourceTable.database;
    const name = tableOperator.name(sourceTable);
    const keyContext = tableOperator.keyContext(sourceTable);
    const dataContext = tableOperator.dataContext(sourceTable);

    const targetTable = await database.createTable(name, keyContext, dataContext);
    tableOperator.targetTable = targetTable;
    sourceTable.subscribe(tableOperator);
    return targetTable;
  }
}
