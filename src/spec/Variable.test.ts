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
    shouldRun: true,
  },
  {
    expected: 'input',
    input: { dsf: [], food: 'truck' },
    testFn: input => {
      return variable.toString({ input });
    },
    label: 'toString: variable input should yield "input"',
    shouldRun: true,
  },
  {
    expected: 'input',
    input: { dsf: [], food: 'truck' },
    testFn: input => {
      return variable.splitCamelCase({ input });
    },
    label: 'splitCamelCase: variable input should yield "input"',
    shouldRun: true,
  },
  {
    expected: 'extr3m3 Camel Casist4 You Swe3tie',
    input: { dsf: [], food: 'truck' },
    testFn: input => {
      const extr3m3CamelCasist4YouSwe3tie = 1;
      return variable.splitCamelCase({ extr3m3CamelCasist4YouSwe3tie });
    },
    label: 'splitCamelCase: variable input should yield "input"',
    shouldRun: true,
  },
];

testTools.tester(testData);
