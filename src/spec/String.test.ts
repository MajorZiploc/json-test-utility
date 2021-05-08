import * as testTools from '../testTools';
import * as _ from 'lodash';
import { string as s } from './../String';

const testData: testTools.testInput[] = [
  {
    expected: 'x',
    input: {},
    testFn: input => {
      return s.splitCamelCase('x');
    },
    label: 'splitCamelCase: string x should yield "x"',
    shouldRun: true,
  },
  {
    expected: 'extr3m3<:>Camel<:>Casist4<:>You<:>Swe3tie',
    input: { str: 'extr3m3CamelCasist4YouSwe3tie', separator: '<:>' },
    testFn: input => {
      return s.splitCamelCase(input.str, input.separator);
    },
    label:
      'splitCamelCase: string extr3m3CamelCasist4YouSwe3tie with separator <:>, should yield "extr3m3<:>Camel<:>Casist4<:>You<:>Swe3tie"',
    shouldRun: true,
  },
  {
    expected: null,
    input: null,
    testFn: input => {
      return s.splitCamelCase(input);
    },
    label: 'splitCamelCase: null case',
    shouldRun: true,
  },
  {
    expected: 'In The W0rds 0f Th3 Wis3',
    input: 'iN thE W0rDs 0F TH3 wis3',
    testFn: input => {
      return s.titleCase(input);
    },
    label: "titleCase: string 'iN thE W0rDs 0F TH3 wis3' should yield 'In The W0rds 0f Th3 Wis3'",
    shouldRun: true,
  },
  {
    expected: 'X',
    input: 'x',
    testFn: input => {
      return s.titleCase(input);
    },
    label: "titleCase: string 'x' should yield 'X'",
    shouldRun: true,
  },
  {
    expected: '',
    input: '',
    testFn: input => {
      return s.titleCase(input);
    },
    label: 'titleCase: empty string',
    shouldRun: true,
  },
  {
    expected: null,
    input: null,
    testFn: input => {
      return s.titleCase(input);
    },
    label: 'titleCase: null case',
    shouldRun: true,
  },
];

testTools.tester(testData);
