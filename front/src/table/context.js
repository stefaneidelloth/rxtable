export default class Context {
  constructor(columnNames) {
    this._columnNames = columnNames;
  }

  [Symbol.iterator]() {
    return this._columnNames[Symbol.iterator]();
  }

  map(lambda){
    return this._columnNames.map(lambda);
  }

  toString(){   
    return this._columnNames.join('|');
  }
}
