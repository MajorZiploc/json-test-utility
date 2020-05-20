"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonComparer_1 = require("./../JsonComparer");
var JsonRefactor_1 = require("../JsonRefactor");
var testTools = require("../testTools");
var _ = require("lodash");
var testData = [
    {
        expected: false,
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
        },
        testFn: function (input) { return JsonComparer_1.jsonComparer.isSubset(input.json1, input.json2); },
        label: 'isSubset - not a subset check',
        shouldRun: true,
    },
    {
        expected: true,
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 123, y: { z: 1 }, jk: 'extra' },
        },
        testFn: function (input) { return JsonComparer_1.jsonComparer.isSubset(input.json1, input.json2); },
        label: 'isSubset - is a subset check',
        shouldRun: true,
    },
    {
        expected: true,
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 'ban', y: { z: 'anas' }, jk: 'extra' },
        },
        testFn: function (input) { return JsonComparer_1.jsonComparer.isSubsetKeys(input.json1, input.json2); },
        label: 'isSubsetKeys - is a subset check',
        shouldRun: true,
    },
    {
        expected: false,
        input: {
            json1: { x1: 123, y: { z: 1 } },
            json2: { x: 'ban', y: { z: 'anas' }, jk: 'extra' },
        },
        testFn: function (input) { return JsonComparer_1.jsonComparer.isSubsetKeys(input.json1, input.json2); },
        label: 'isSubsetKeys - is not a subset check',
        shouldRun: true,
    },
    {
        expected: true,
        input: { array1: [1, 2, { qq: ';-;' }], array2: [{ qq: ';-;' }, 2, 1] },
        testFn: function (input) { return JsonComparer_1.jsonComparer.containSameElements(input.array1, input.array2); },
        label: 'Check if the arrays have the same elements.',
        shouldRun: true,
    },
    {
        expected: true,
        input: {
            json1: { x1: 'BIGBOY', y: { z: 1 } },
            json2: { x: 'bigboy', y: { z: 'anas' }, jk: 'extra' },
        },
        testFn: function (input) {
            return JsonComparer_1.jsonComparer.isSubsetSpecialCases(input.json1, input.json2, ['x1', 'y'], [function (sub, sup) { return _.isEqual(sub.toLowerCase(), sup.toLowerCase()); }, function (sub, sup) { return JsonRefactor_1.jsonRefactor.sameKeys(sub, sup); }], ['x', 'y']);
        },
        label: 'isSubsetSpecialCases - is a subset check',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=JsonComparer.test.js.map