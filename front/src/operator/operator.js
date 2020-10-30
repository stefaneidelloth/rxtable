import TableSubscriber from '../table/tableSubscriber';

export default class Operator extends TableSubscriber {

  constructor(name){
    super();
    this._name = name;
    this._targetTable = undefined;
    this._sourceTable = undefined;
  }

  set targetTable(table){
    this._targetTable = table;
  }

  dataContext(sourceTable){
    return sourceTable.dataContext;
  }

  idChanged(newKey, columnName, oldId, newId){
    //might be overridden by inheriting class
  }

  initialized(sourceTable){
    this._sourceTable = sourceTable;
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  name(sourceTable){
    return sourceTable.name + '_' + this.constructor.name;
  }

  rowChanged(table, oldRow, newRow){
    for(let idColumnName of table.keyContext){
      const oldId = oldRow[idColumnName];
      const newId = newRow[idColumnName];
      if(newId !== oldId){
        const newKey = table.createKey(newRow);
        this.idChanged(table, newKey, idColumnName, oldId, newId);
      }
    }

    for(let valueColumnName of sourceTable.valueContext){
      const oldValue = oldRow[valueColumnName];
      const newValue = newRow[valueColumnName];
      if(newValue !== oldValue){
        const key = table.createKey(newRow);
        this.valueChanged(table, key, valueColumnName, oldValue, newValue);
      }
    }
  }

  valueChanged(table, key, columnName, oldValue, newValue){
    //might be overridden by inheriting class
  }

}

