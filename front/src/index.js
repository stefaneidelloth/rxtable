import * as d3 from 'd3';
import { range, Observable } from 'rxjs';

import DatabaseFactory from './database/databaseFactory';
import KeyContext from './table/keyContext';
import DataContext from './table/dataContext';
import { add } from './operator/operators';

run();

async function run() {
  const databaseFactory = new DatabaseFactory();
  const database = await databaseFactory.create('project');

  const keyContext = new KeyContext(['scenario_id','country_id']);
  const dataContext = new DataContext(['y2020','y2030','y2040']);

  const inputTable = await database.createTable('input', keyContext, dataContext);

  const inputRow = {
    scenario_id: 0,
    country_id: 0,
    y2020: 1,
    y2030: 2,
    y2040: 3,
  };

  let newValue = 4;
  async function buttonClicked() {
    inputRow.y2040 = newValue;
    await inputTable.update(inputRow);
    newValue++;
  }

  d3.select('#root')
    .append('button')
    .text('Click me')
    .on('click', () => buttonClicked());

  // doc for Observable API:
  // https://rxjs.dev/api/index/class/Observable

  // doc for pipe-able operators:
  // https://rxjs.dev/guide/operators
  // https://rxjs.dev/api/operators
  inputTable.pipe(
    add('sum', 66)
  )
  .subscribe({
    initialized(table) {
      console.log(`table: ${table.name}`);
    },
    rowAdded(newRow) {
      console.log(`rowAdded`);
    },
    rowChanged(oldRow, newRow) {
      console.log(`rowChanged`);
    },
    error(error) { console.error(`error: ${error}`); },
    complete() { console.log('done'); },
  });

  await inputTable.push(inputRow);

  await inputTable.push({
    scenario_id: 1,
    country_id: 1,
    y2020: 11,
    y2030: 12,
    y2040: 13,
  });

}
