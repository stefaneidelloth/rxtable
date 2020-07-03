export default class ObservableCollection {
  constructor(rxDbCollection) {
    this._wrappedCollection = rxDbCollection;
  }

  findOne(options){
    return this._wrappedCollection.findOne(options);
  }

  async insert(rowValues){
    return await this._wrappedCollection.insert(rowValues);
  }

  pipe(argument){
    return this._wrappedCollection.$.pipe(argument);
  }

  async update(rowValues){
    return await this._wrappedCollection.upsert(rowValues);
  }

  subscribe(subscriber) {
    return this._wrappedCollection.$.subscribe(subscriber);
  }
}
