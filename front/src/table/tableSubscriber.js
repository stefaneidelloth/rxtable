export default class TableSubscriber {

  async columnAdded(newColumn){
     throw new Error('Not yet implemented!');
  }

  async columnChanged(oldColumn, newColumn){
      throw new Error('Not yet implemented!');
  }

  async columnRemoved(oldColumn){
      throw new Error('Not yet implemented!');
  }

  error(error){
    console.error('error: ' + error);
  }

  async initialized(table){
    
  }

  async rowAdded(newRow){
    throw new Error('Not yet implemented!');
  }

  async rowChanged(oldRow, newRow){
    throw new Error('Not yet implemented!');
  }

  async rowRemoved(oldRow){
    throw new Error('Not yet implemented!');
  }

}

