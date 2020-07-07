import Add from './add.js';

export const
  add = (name, ...summands) => new Add(name, ...summands);

