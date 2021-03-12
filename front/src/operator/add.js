import Operator from './operator';

export default class Add extends Operator {

  constructor(name, ...summands){
    super(name);
    this._summands = summands;
  }

  valueContext(sourceTable){
    return sourceTable.valueContext;
  }

  async initialized(sourceTable){
    await super.initialized(sourceTable);
    
    for await (let sourceRow of sourceTable){
      await this._createTargetRow(sourceRow, sourceTable);
    }
    
  }  

  async _createTargetRow(sourceRow, sourceTable){

    let newRow = {};
    for (var key of sourceTable.keyContext){
      newRow[key] = sourceRow[key];
    }
    
    for(let valueColumnName of sourceTable.valueContext){
      newRow[valueColumnName] = sourceRow[valueColumnName] + this._sum(this._summands);
    }
    await this._targetTable.push(newRow);
  }

  _sum(array){
    return array.reduce((a,b)=>a+b);
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  name(sourceTable){
    return this._name;
  }

  async columnAdded(table, newColumn){
     console.log('add operator: column added');
  }

  async columnChanged(table, oldColumn, newColumn){
      console.log('add operator: column changed');
  }

  async columnRemoved(table, oldColumn){
      console.log('add operator: column removed');
  }

  async idChanged(newKey, columnName, oldId, newId){
    throw new Error('Not yet implemented');
  }

  async valueChanged(sourceTable, sourceKey, valueColumnName, oldValue, newValue){
    var targetRow = await this._targetTable.row(sourceKey); //target and source id must be the same here
    targetRow[valueColumnName] = targetRow[valueColumnName] + (newValue-oldValue);
    await this._targetTable.update(targetRow);
  }

  async rowAdded(sourceTable, sourceRow){
    await this._createTargetRow(sourceRow, sourceTable);
  }

  async rowRemoved(table, oldRow){
    console.log('add operator: row removed');
  }

}