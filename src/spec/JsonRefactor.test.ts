import { jsonRefactor as jr } from '../JsonRefactor';
import { jsonComparer as jc } from '../JsonComparer';
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
    input: { x: 12, y: { g: 'ba' }, z: [1, 2, 3] },
    testFn: input => {
      const actual = jr.toKeyValArray(input);
      const expected = [
        { key: 'x', value: 12 },
        { key: 'y', value: { g: 'ba' } },
        { key: 'z', value: [1, 2, 3] },
      ];
      return jc.containSameElements(actual, expected);
    },
    label: 'toKeyValArray',
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
  {
    expected: { x: 1, y: 2, z: { zz: [1, 2, 3, {}, [], ''] } },
    input: { json1: { x: 1, y: 2 }, json2: { z: { zz: [1, 2, 3, {}, [], ''] } } },
    testFn: input => jr.concatJsons(input.json1, input.json2),
    label: 'concatJsons - happy path',
    shouldRun: true,
  },
  {
    expected: 'The two jsons that are being combined have keys in common.\nCommon keys:\nx\nz',
    input: { json1: { x: 1, y: 2, z: 234 }, json2: { x: {}, z: { zz: [1, 2, 3, {}, [], ''] } } },
    testFn: input => {
      try {
        jr.concatJsons(input.json1, input.json2);
        return 'Should not get here!';
      } catch (e) {
        return e.message;
      }
    },
    label: 'concatJsons - error path',
    shouldRun: true,
  },
  {
    expected: { y: 2, z: 4 },
    input: { json1: { x: 1, y: 2, z: 4, a: { xa: ['', {}] } }, json2: { a: 3, x: [] } },
    testFn: input => jr.minusJsons(input.json1, input.json2),
    label: 'minusJsons',
    shouldRun: true,
  },
  ,
];

testTools.tester(testData);
