import Operator from './operator';

export default class Add extends Operator {

  constructor(name, ...summands){
    super(name);
    this._summands = summands;
  }

  dataContext(sourceTable){
    return sourceTable.dataContext;
  }

  async initialized(sourceTable){
    await super.initialized(sourceTable);
    
    for await (let row of sourceTable){
      let newRow = {...row};
      for(let valueColumnName of sourceTable.dataContext){
        newRow[valueColumnName] = row[valueColumnName] + this.sum(this._summands);
      }
      await this._targetTable.push(newRow);
    }
    
  }  

  sum(array){
    return array.reduce((a,b)=>a+b);
  }

  keyContext(sourceTable){
    return sourceTable.keyContext;
  }

  name(sourceTable){
    return this._name;
  }

  valueChanged(sourceTable, sourceKey, valueColumnName, oldValue, newValue){
    var targetRow = this._targetTable.row(sourceKey);
    targetRow[valueColumnName] = oldValue + (newValue-oldValue);
  }

  columnAdded(newColumn){
     console.log('column added');
  }

  columnChanged(oldColumn, newColumn){
      console.log('column changed');
  }

  columnRemoved(oldColumn){
      console.log('column removed');
  }

  rowAdded(newRow){
    console.log('row added');
  }

  rowRemoved(oldRow){
    console.log('row removed');
  }

}