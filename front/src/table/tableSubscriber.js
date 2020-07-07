export default class TableSubscriber {

  columnAdded(newColumn){
     throw new Error('Not yet implemented!');
  }

  columnChanged(oldColumn, newColumn){
      throw new Error('Not yet implemented!');
  }

  columnRemoved(oldColumn){
      throw new Error('Not yet implemented!');
  }

  error(error){
    console.error('error: ' + error);
  }

  initialized(table){
    throw new Error('Not yet implemented!');
  }

  rowAdded(newRow){
    throw new Error('Not yet implemented!');
  }

  rowChanged(oldRow, newRow){
    throw new Error('Not yet implemented!');
  }

  rowRemoved(oldRow){
    throw new Error('Not yet implemented!');
  }

}

