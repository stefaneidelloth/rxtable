import TableEvent from './tableEvent';

export default class TableCollection {

  constructor(table, rxDbCollection) {
    this._table = table;
    this._wrappedCollection = rxDbCollection;
    this._count=0;
  }

  findOne(options){
    return this._wrappedCollection.findOne(options);
  }

  async insert(rowValues){
    const result = await this._wrappedCollection.insert(rowValues);
    this._count++;
    return result;
  }

  async update(rowValues){
    return await this._wrappedCollection.upsert(rowValues);
  }

  async subscribe(tableSubscriber) {
    const rxDbSubscriber = async event => {
       const tableEvent = await this._tableEvent(event);
       switch(tableEvent){
        case TableEvent.initialized:          
          tableSubscriber.initialized(this._table);
          break;
        case TableEvent.rowAdded:
          const addedRow = event.documentData;
          tableSubscriber.rowAdded(addedRow);
          break;
        case TableEvent.rowChanged:
          const oldRow = event.previousData;
          const newRow = event.documentData;
          tableSubscriber.rowChanged(oldRow, newRow);
          break;
        case TableEvent.rowRemoved:
          tableSubscriber.rowRemoved(oldRow);
          break;
        case TableEvent.columnAdded:
          tableSubscriber.columnAdded(newColumn);
          break;
        case TableEvent.columnChanged:
          tableSubscriber.columnChanged(oldColumn, newColumn);
          break;
        case TableEvent.columnRemoved:
          tableSubscriber.columnRemoved(oldColumn);
          break;
        default:
          throw new Error('Table event "' + tableEvent + '" has not yet been implemented.')
       }
    };
    return await this._wrappedCollection.$.subscribe(rxDbSubscriber);
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
