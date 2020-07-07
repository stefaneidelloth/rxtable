export default class Table {

  constructor(name, database, keyContext, dataContext) {
    this._name = name;
    this._database = database;
    this._keyContext = keyContext;
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
    let selector = this._rowSelector(newRowValues);

    const changeFunction = (rowValues) => {
        for(let columnName of this._dataContext){
          let newValue = newRowValues[columnName];
          if(rowValues[columnName] !== newValue){
            rowValues[columnName] = newValue;
          }
        }
        return rowValues;
    }

    await this._collection.findOne({selector: selector})
      .exec()
      .then(async document=>{
          await document.atomicUpdate(changeFunction);
      });

  }

  _rowSelector(rowValues){
    let selector = {};
    for(let columnName of this._keyContext){
      selector[columnName] = {$eq: rowValues[columnName]};
    }
    return selector;
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
