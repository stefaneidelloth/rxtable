import Operator from './operator';

export default class Add extends Operator {

  constructor(name, ...summands){
    super();
    this._name = name;
    this._summands = summands;
  }

  dataContext(sourceTable){
    return sourceTable.dataContext;
  }

  initialized(sourceTable){
    for(let row of sourceTable){
      let newRow = row.copy();
      for(let valueColumnName of sourceTable.valueContext){
        newRow[valueColumnName] = row[valueColumnName] + this._summands.sum();
      }
      this._targetTable.insert(newRow);
    }
  }

  rowChanged(oldRow, newRow){
    throw new Error('Not yet implemented!');
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  name(sourceTable){
    return this._name;
  }

}