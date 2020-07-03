export default class Context {
  constructor(columnNames) {
    this._columnNames = columnNames;
  }

  [Symbol.iterator]() {
    return this._columnNames[Symbol.iterator]();
  }
}
