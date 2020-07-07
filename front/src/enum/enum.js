export default class Enum {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  toString() {
    return this.name;
  }

  static get label() {
    // this method must be overridden by the inheriting classes
    // I tried to automatically determine the label from the
    // class name. However, if the code is compiled/minified the
    // class name can change, e.g. ChartType => Ce.
    // Therefore, the label must be explicitly specified.
    throw new Error('This method must be overridden by the inheriting class.');
  }

  static get values() {
    return Object.values(this);
  }

  static forName(name) {
    for (const enumValue of this.values) {
      if (enumValue.name === name) {
        return enumValue;
      }
    }
    throw new Error(`Unknown value "${name}"`);
  }
}
