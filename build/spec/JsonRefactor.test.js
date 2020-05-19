'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var JsonRefactor_1 = require('./../JsonRefactor');
var testTools = require('./../testTools');
var _ = require('lodash');
var testData = [
  {
    expected: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    input: { status: 200, e: 'jones' },
    testFn: function (input) {
      return JsonRefactor_1.jr.addField(input, 'j.i', { k: [{ x: 1 }, 1] });
    },
    label: 'AddField',
    shouldRun: true,
  },
  {
    expected: { status: 200, e: 300 },
    input: { status: 200, e: 'jones' },
    testFn: function (input) {
      return JsonRefactor_1.jr.setField(input, 'e', 300);
    },
    label: 'SetField',
    shouldRun: true,
  },
  {
    expected: { status: 200, e: 'jones', j: { i: {} } },
    input: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    testFn: function (input) {
      return JsonRefactor_1.jr.removeField(input, 'j.i.k');
    },
    label: 'RemoveField',
    shouldRun: true,
  },
  {
    expected: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    input: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
    testFn: function (input) {
      return JsonRefactor_1.jr.copy(input);
    },
    label: 'Copy',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 } },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.sameKeys(input.json1, input.json2);
    },
    label: 'sameKeys - for jsons with same keys',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.sameKeys(input.json1, input.json2);
    },
    label: 'sameKeys - for jsons with different keys',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.isSubset(input.json1, input.json2);
    },
    label: 'isSubset - not a subset check',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 123, y: { z: 1 }, jk: 'extra' },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.isSubset(input.json1, input.json2);
    },
    label: 'isSubset - is a subset check',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'ban', y: { z: 'anas' }, jk: 'extra' },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.isSubsetKeys(input.json1, input.json2);
    },
    label: 'isSubsetKeys - is a subset check',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x1: 123, y: { z: 1 } },
      json2: { x: 'ban', y: { z: 'anas' }, jk: 'extra' },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.isSubsetKeys(input.json1, input.json2);
    },
    label: 'isSubsetKeys - is not a subset check',
    shouldRun: true,
  },
  {
    expected: true,
    input: { array1: [1, 2, { qq: ';-;' }], array2: [{ qq: ';-;' }, 2, 1] },
    testFn: function (input) {
      return JsonRefactor_1.jr.containSameElements(input.array1, input.array2);
    },
    label: 'Check if the arrays have the same elements.',
    shouldRun: true,
  },
  {
    expected: true,
    input: { x: 12, y: { g: 'ba' }, z: [1, 2, 3] },
    testFn: function (input) {
      var actual = JsonRefactor_1.jr.toKeyValArray(input);
      var expected = [
        { key: 'x', value: 12 },
        { key: 'y', value: { g: 'ba' } },
        { key: 'z', value: [1, 2, 3] },
      ];
      return JsonRefactor_1.jr.containSameElements(actual, expected);
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
    testFn: function (input) {
      var actual = JsonRefactor_1.jr.fromKeyValArray(input);
      var expected = { x: 12, y: { g: 'ba' }, z: [1, 2, 3] };
      return _.isEqual(actual, expected);
    },
    label: 'fromKeyValArray',
    shouldRun: true,
  },
  {
    expected: { x: 1 },
    input: { x: 1, y: 2, z: 3 },
    testFn: function (input) {
      return JsonRefactor_1.jr.subJsonExcept(input, ['y', 'z']);
    },
    label: 'subJsonExcept',
    shouldRun: true,
  },
  {
    expected: { y: 2, z: 3 },
    input: { x: 1, y: 2, z: 3 },
    testFn: function (input) {
      return JsonRefactor_1.jr.subJson(input, ['y', 'z']);
    },
    label: 'subJson',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x1: 'BIGBOY', y: { z: 1 } },
      json2: { x: 'bigboy', y: { z: 'anas' }, jk: 'extra' },
    },
    testFn: function (input) {
      return JsonRefactor_1.jr.isSubsetSpecialCases(
        input.json1,
        input.json2,
        ['x1', 'y'],
        [
          function (sub, sup) {
            return _.isEqual(sub.toLowerCase(), sup.toLowerCase());
          },
          function (sub, sup) {
            return JsonRefactor_1.jr.sameKeys(sub, sup);
          },
        ],
        ['x', 'y']
      );
    },
    label: 'isSubsetSpecialCases - is a subset check',
    shouldRun: true,
  },
];
testTools.tester(testData);
//# sourceMappingURL=JsonRefactor.test.js.map
