const createEnforcer = Symbol();

export default class Table {
  static enforcer() {
    return createEnforcer;
  }

  constructor(enforcer, name, database, keyContext, dataContext) {
    if (enforcer !== createEnforcer) {
      throw 'Table cannot be constructed directly. Please use method "Database.createTable".';
    }
    this._name = name;
    this._database = database;
    this._keyContext = keyContext;
    this._dataContext = dataContext;
    this._collection = undefined;
  }

  async init() {
    this._collection = await this._database.createObservableCollection(
      this._name,
      this._keyContext,
      this._dataContext
    );
  }

  get keyContext() {
    return this._keyContext;
  }

  get valueContext() {
    return this._valueContext;
  }

  get keys() {

  }

  contains(key) {

  }

  idSet(idColumnName) {

  }

  async push(rowValues) {
    return await this._collection.insert(rowValues);
  }

  pipe(argument){
    return this._collection.pipe(argument);
  }

  row(key) {

  }

  subscribe(subscriber) {
    return this._collection.subscribe(subscriber);
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
}
