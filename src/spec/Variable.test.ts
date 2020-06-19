import * as testTools from '../testTools';
import { jsonMigration } from '../JsonMigration';
import * as _ from 'lodash';
import * as m from './JsonMigrators';
import { ListOfJsonMigratorOf } from './../ListOfJsonMigrator';
import * as test from 'tape-catch';
import { variable } from './../Variable';

const testData: testTools.testInput[] = [
  {
    expected: 'x',
    input: {},
    testFn: input => {
      const x = 'sweet';
      return variable.toString({ x });
    },
    label: 'toString: variable x should yield "x"',
  },
  {
    expected: 'input',
    input: { dsf: [], food: 'truck' },
    testFn: input => {
      return variable.toString({ input });
    },
    label: 'toString: variable input should yield "input"',
  },
];

testTools.tester(testData);
