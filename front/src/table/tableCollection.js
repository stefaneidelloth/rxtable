import TableEvent from './tableEvent';

export default class TableCollection {

  constructor(table, rxDbCollection) {
    this._table = table;
    this._wrappedCollection = rxDbCollection;
    this._keyMap = {};
    this._count = 0 ;
  }

  async insert(rowValues){
    const key = this._table.createKey(rowValues);
    const result = await this._wrappedCollection.insert(rowValues);
    this._keyMap[key] = result._id;
    this._count++;
    return key;
  }

  async row(key){
    const _id = this._keyMap[key];
    const rowValues = await this._wrappedCollection.findById(_id);
    return this._table.createRow(rowValues);
  }

  async subscribe(tableSubscriber) {
    const rxDbSubscriber = async event => {
       const tableEvent = await this._tableEvent(event);
       switch(tableEvent){
        case TableEvent.initialized:          
          tableSubscriber.initialized(this._table);
          break;
        case TableEvent.rowAdded:
          const addedRow = this._table.createRow(event.documentData);
          tableSubscriber.rowAdded(this._table, addedRow);
          break;
        case TableEvent.rowChanged:
          const oldRow = this._table.createRow(event.previousData);
          const newRow = this._table.createRow(event.documentData);
          tableSubscriber.rowChanged(this._table, oldRow, newRow);
          break;
        case TableEvent.rowRemoved:
          const oldRow = this._table.createRow(event.previousData);
          tableSubscriber.rowRemoved(this._table, oldRow);
          break;
        case TableEvent.columnAdded:
          tableSubscriber.columnAdded(this._table, newColumn);
          break;
        case TableEvent.columnChanged:
          tableSubscriber.columnChanged(this._table, oldColumn, newColumn);
          break;
        case TableEvent.columnRemoved:
          tableSubscriber.columnRemoved(this._table, oldColumn);
          break;
        default:
          throw new Error('Table event "' + tableEvent + '" has not yet been implemented.')
       }
    };
    return await this._wrappedCollection.$.subscribe(rxDbSubscriber);
  }

  async update(newRowValues){
    return await this._wrappedCollection.upsert(newRowValues);
  }

  async atomicUpdate(newRowValues) {

    let selector = this._rowSelector(newRowValues);

    const changeFunction = (rowValues) => {
        for(let columnName of this._table.dataContext){
          let newValue = newRowValues[columnName];
          if(rowValues[columnName] !== newValue){
            rowValues[columnName] = newValue;
          }
        }
        return rowValues;
    }

    await this._wrappedCollection.findOne({selector: selector})
      .exec()
      .then(async document=>{
          await document.atomicUpdate(changeFunction);
      });
  }

  _rowSelector(rowValues){
    let selector = {};
    for(let columnName of this._table.keyContext){
      selector[columnName] = {$eq: rowValues[columnName]};
    }
    return selector;
  }

  async _tableEvent(rxDbEvent){
    switch(rxDbEvent.operation){
      case 'INSERT':
        const collection = rxDbEvent.rxDocument.collection;
        if(this._count === 0){
          return TableEvent.initialized;
        }
        return TableEvent.rowAdded;
        break;
      case 'UPDATE':
        return TableEvent.rowChanged;
        break;
      default:
        throw new Error('Unknown operation ' + rxDbEvent.operation);
    }
  }

}
