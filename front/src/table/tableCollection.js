import TableEvent from './tableEvent';

export default class TableCollection {

  constructor(table, rxDbCollection) {
    this._table = table;
    this._wrappedRxDbCollection = rxDbCollection;
    this._keyMap = {};
    this._count = 0 ;
  }

  async* [Symbol.asyncIterator]() {   
    var entries = await this._wrappedRxDbCollection.find().exec();
    for (var current_entry of entries){
      var data = current_entry.toJSON();
      yield data;
    } 
  }

  async insert(rowValues){
    const key = this._table.createKey(rowValues);
    const result = await this._wrappedRxDbCollection.insert(rowValues);
    this._keyMap[key] = result._id;
    this._count++;
    return key;
  }

  async row(key){
    const _id = this._keyMap[key];
    const rowValues = await this._wrappedRxDbCollection.findById(_id);
    return this._table.createRow(rowValues);
  }

  async subscribe(tableSubscriber) {
    const rxDbSubscriber = async event => {
       const tableEvent = await this._tableEvent(event);

       switch(tableEvent){
        case TableEvent.initialized:          
          // nothing to do
          break;
        case TableEvent.rowAdded:
          const addedRow = this._table.createRow(event.documentData);
          tableSubscriber.rowAdded(this._table, addedRow);
          break;
        case TableEvent.rowChanged:
          var oldRow = this._table.createRow(event.previousData);
          const newRow = this._table.createRow(event.documentData);
          tableSubscriber.rowChanged(this._table, oldRow, newRow);
          break;
        case TableEvent.rowRemoved:
          const removedRow = this._table.createRow(event.previousData);
          tableSubscriber.rowRemoved(this._table, removedRow);
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
    await this._wrappedRxDbCollection.$.subscribe(rxDbSubscriber);    
    return this;
  }

  async dump(){
    return this._wrappedRxDbCollection.dump();
  }

  async update(newRowValues){
    const key = this._table.createKey(newRowValues);
    const _id = this._keyMap[key]
    var entry = {...newRowValues};
    entry['_id'] = _id;   
    return await this._wrappedRxDbCollection.upsert(entry);
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

    await this._wrappedRxDbCollection.findOne({selector: selector})
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
