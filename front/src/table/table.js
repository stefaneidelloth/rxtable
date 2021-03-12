export default class Table {

  constructor(name, database, keyContext, valueContext) {
    this._name = name;
    this._database = database;
    this._keyContext = keyContext;
    this._keyMap = {};
    this._valueContext = valueContext;
    this._tableCollection = undefined;
  }

  get database() {
    return this._database;
  }

  get valueContext() {
    return this._valueContext;
  }

  get keyContext() {
    return this._keyContext;
  }

  get name() {
    return this._name;
  }

  async init() {
    this._tableCollection = await this._database.createTableCollection(this);
  }

  [Symbol.asyncIterator]() {
    return this._tableCollection[Symbol.asyncIterator]();
  }

  pipe(...tableOperators){

    let table = this;

    let promise = new Promise(async (resolve) =>{
      for (let tableOperator of tableOperators){
       table = await this._subscribeOperator(tableOperator, table);       
      }
      resolve(table);
    });

    promise.subscribe = async (subscriber)=>{
      await promise.then(async (resultTable) => {
        await resultTable.subscribe(subscriber);
      })
      return promise;
    };

    return promise;
  }

  async push(rowValues) {
    return await this._tableCollection.push(rowValues);
  }

  async subscribe(tableSubscriber) {    
      await this._tableCollection.subscribe(tableSubscriber); 
      await tableSubscriber.initialized(this);           
      return this;
  }

  async update(newRowValues) {
    await this._tableCollection.update(newRowValues);
  }

  createKey(rowValues){
    return this.keyContext.map(keyColumnName=>rowValues[keyColumnName]);
  }

  createRow(rowValues){
    var row = {...rowValues};   
    return row;
  }

  async row(key) {
    return await this._tableCollection.row(key);
  }

  async _subscribeOperator(tableOperator, sourceTable){
    const database = sourceTable.database;
    const name = tableOperator.name(sourceTable);
    const keyContext = tableOperator.keyContext(sourceTable);
    const valueContext = tableOperator.valueContext(sourceTable);

    const targetTable = await database.createTable(name, keyContext, valueContext);
    tableOperator.targetTable = targetTable;
    sourceTable.subscribe(tableOperator);
    return targetTable;
  } 

  async dump(){
    return this._tableCollection.dump();
  }

  async show(){
    console.log('Table "' + this.name + '":');   
    var headers = [...this.keyContext, ...this.valueContext];
    var data = {};  
    for await (var row of this){       
      data[row._id] = row;
    }  
    if(Object.keys(data).length>0){
      console.table(data, headers);
    } else {      
      console.log('|' + headers.join('|') + '|')
      console.log('... is empty')
    }
    
  }

  
}
