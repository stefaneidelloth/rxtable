import * as d3 from 'd3';
import { range, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import DatabaseFactory from './database/databaseFactory';
import KeyContext from './table/keyContext';
import DataContext from './table/dataContext';

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

  await inputTable.push(inputRow);

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
  inputTable
    .pipe(
      filter(event => {
          return event.documentData.y2040 < 6;
        }
      )
    )
    .subscribe({
      next(event) {
        let item = event.documentData;
        console.log(`scenario: ${item.scenario_id}, y2040: ${item.y2040}`);
      },
      error(error) { console.error(`rx error: ${error}`); },
      complete() { console.log('rx done'); },
    });

}
