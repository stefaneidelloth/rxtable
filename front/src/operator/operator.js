import TableSubscriber from '../table/tableSubscriber';

export default class Operator extends TableSubscriber {

  constructor(){
    super();
    this._targetTable = undefined;
  }

  set targetTable(table){
    this._targetTable = table;
  }

  name(sourceTable){
    return sourceTable.name + '_' + this.constructor.name;
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  dataContext(sourceTable){
    return sourceTable.dataContext;
  }

}

