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

  valueContext(sourceTable){
    return sourceTable.valueContext;
  }  

  async initialized(sourceTable){
    this._sourceTable = sourceTable;
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  name(sourceTable){
    return sourceTable.name + '_' + this.constructor.name;
  }

  async rowChanged(table, oldRow, newRow){
    for(let idColumnName of table.keyContext){
      const oldId = oldRow[idColumnName];
      const newId = newRow[idColumnName];
      if(newId !== oldId){
        const newKey = table.createKey(newRow);
        await this.idChanged(table, newKey, idColumnName, oldId, newId);
      }
    }

    for(let valueColumnName of table.valueContext){
      const oldValue = oldRow[valueColumnName];
      const newValue = newRow[valueColumnName];
      if(newValue !== oldValue){
        const key = table.createKey(newRow);
        await this.valueChanged(table, key, valueColumnName, oldValue, newValue);
      }
    }
  }

  async idChanged(newKey, columnName, oldId, newId){
    throw new Error('Should be overridden by inheriting class');
  }

  async valueChanged(table, key, columnName, oldValue, newValue){
    throw new Error('Should be overridden by inheriting class');
  }

}

