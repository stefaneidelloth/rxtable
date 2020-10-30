import Operator from './operator';

export default class Add extends Operator {

  constructor(name, ...summands){
    super(name);
    this._summands = summands;
  }

  dataContext(sourceTable){
    return sourceTable.dataContext;
  }

  initialized(sourceTable){
    super.initialized(sourceTable);
    for(let row of sourceTable){
      let newRow = row.copy();
      for(let valueColumnName of sourceTable.valueContext){
        newRow[valueColumnName] = row[valueColumnName] + this._summands.sum();
      }
      this._targetTable.insert(newRow);
    }
  }

  valueChanged(sourceTable, sourceKey, valueColumnName, oldValue, newValue){
    var targetRow = this._targetTable.row(sourceKey);
    targetRow[valueColumnName] = oldValue + (newValue-oldValue);
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  name(sourceTable){
    return this._name;
  }

}