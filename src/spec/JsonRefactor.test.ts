import { jsonRefactor as jr } from '../JsonRefactor';
import * as testTools from '../testTools';
import * as _ from 'lodash';

const testData: testTools.testInput[] = [
  {
    expected: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    input: { status: 200, e: 'jones' },
    testFn: input => jr.addField(input, 'j.i', { k: [{ x: 1 }, 1] }),
    label: 'AddField',
    shouldRun: true,
  },
  {
    expected: { status: 200, e: 300 },
    input: { status: 200, e: 'jones' },
    testFn: input => jr.setField(input, 'e', 300),
    label: 'SetField',
    shouldRun: true,
  },
  {
    expected: { status: 200, e: 'jones', j: { i: {} } },
    input: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    testFn: input => jr.removeField(input, 'j.i.k'),
    label: 'RemoveField',
    shouldRun: true,
  },
  {
    expected: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    input: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    testFn: input => jr.copy(input),
    label: 'Copy',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 } },
    },
    testFn: input => jr.sameKeys(input.json1, input.json2),
    label: 'sameKeys - for jsons with same keys',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
    },
    testFn: input => jr.sameKeys(input.json1, input.json2),
    label: 'sameKeys - for jsons with different keys',
    shouldRun: true,
  },
  {
    expected: true,
    input: [
      { key: 'x', value: 12 },
      { key: 'y', value: { g: 'ba' } },
      { key: 'z', value: [1, 2, 3] },
    ],
    testFn: input => {
      const actual = jr.fromKeyValArray(input);
      const expected = { x: 12, y: { g: 'ba' }, z: [1, 2, 3] };
      return _.isEqual(actual, expected);
    },
    label: 'fromKeyValArray',
    shouldRun: true,
  },
  {
    expected: { x: 1 },
    input: { x: 1, y: 2, z: 3 },
    testFn: input => jr.subJsonExcept(input, ['y', 'z']),
    label: 'subJsonExcept',
    shouldRun: true,
  },
  {
    expected: { y: 2, z: 3 },
    input: { x: 1, y: 2, z: 3 },
    testFn: input => jr.subJson(input, ['y', 'z']),
    label: 'subJson',
    shouldRun: true,
  },
];

testTools.tester(testData);
