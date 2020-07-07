import Enum from '../enum/enum';

export default class TableEvent extends Enum {
  static get label() {
    return 'Table event';
  }
}

TableEvent.initialized = new TableEvent('initialized');
TableEvent.rowAdded = new TableEvent('rowAdded');
TableEvent.rowChanged = new TableEvent('rowChanged');
TableEvent.rowRemoved = new TableEvent('rowRemoved');
TableEvent.columnAdded = new TableEvent('columnAdded');
TableEvent.columnChanged = new TableEvent('columnChanged');
TableEvent.columnRemoved = new TableEvent('columnRemoved');