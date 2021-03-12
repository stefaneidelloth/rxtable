import * as d3 from 'd3';
import { range, Observable } from 'rxjs';

import DatabaseFactory from './database/databaseFactory';
import KeyContext from './table/keyContext';
import ValueContext from './table/valueContext';
import { add } from './operator/operators';

run();

// doc for Observable API:
// https://rxjs.dev/api/index/class/Observable

// doc for pipe-able operators:
// https://rxjs.dev/guide/operators
// https://rxjs.dev/api/operators

async function run() {
  const databaseFactory = new DatabaseFactory();
  const database = await databaseFactory.create('project');

  const keyContext = new KeyContext(['scenario_id','country_id']);
  const valueContext = new ValueContext(['y2020','y2030','y2040']);

  const inputTable = await database.createTable('input', keyContext, valueContext);

  const inputRow = {
    scenario_id: 0,
    country_id: 0,
    y2020: 1,
    y2030: 2,
    y2040: 3,
  };

  await inputTable.push(inputRow);

  await inputTable.show();



  let newValue = 4;
  async function updateCellOfInputTable() {
    inputRow.y2040 = newValue;
    await inputTable.update(inputRow);
    newValue++;
  }

  d3.select('#root')
    .append('button')
    .text('Update cell of input table')
    .on('click', () => updateCellOfInputTable());


  await inputTable.pipe(
    add('sum', 66)
  )
  .subscribe({   
    async columnAdded(table, newColumn){
      console.log(`# columnAdded`);
    },

    async columnChanged(table, oldColumn, newColumn){
      console.log(`# columnChanged`);
    },

    async columnRemoved(table, oldColumn){
        console.log(`# columnRemoved`);
    },

    async initialized(table){
      console.log(`# initialized`);
      await table.show();
    },

    async rowAdded(table, newRow) {
      console.log(`# rowAdded`);
      await table.show();
    },

    async rowChanged(table, oldRow, newRow){
      console.log(`# rowChanged`);
        await table.show();
    },    

    async rowRemoved(table, oldColumn){
        console.log(`# rowRemoved`);
    },

    error(error) { 
      console.error(`# error: ${error}`); 
    },

    complete() { 
      console.log('done'); 
    }
  });
 

  await inputTable.push({
    scenario_id: 1,
    country_id: 1,
    y2020: 11,
    y2030: 12,
    y2040: 13,
  });
  

  

}
