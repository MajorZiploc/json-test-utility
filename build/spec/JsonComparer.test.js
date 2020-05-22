"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonComparer_1 = require("./../JsonComparer");
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
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 'asdffd', y: { fdsa: 1 } },
        },
        testFn: function (input) { return JsonComparer_1.jsonComparer.sameKeys(input.json1, input.json2); },
        label: 'sameKeys - for jsons with same keys',
        shouldRun: true,
    },
    {
        expected: true,
        input: {},
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson - {}',
        shouldRun: true,
    },
    {
        expected: true,
        input: '{}',
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson - "{}"',
        shouldRun: true,
    },
    {
        expected: true,
        input: { x: 1, y: { yy: [1, 2, { x: 'x' }, 2.2, []] } },
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson - complex json structure',
        shouldRun: true,
    },
    {
        expected: true,
        input: '{"a":0, "bas-dsf": "asdfff", "b0d": [1,2.3,"23",{},{"i": {"x":"games"}}]}',
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson - complex json structure in a string',
        shouldRun: true,
    },
    {
        expected: false,
        input: 'x',
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson - "x"',
        shouldRun: true,
    },
    {
        expected: false,
        input: '',
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson - ""',
        shouldRun: true,
    },
    {
        expected: true,
        input: '[]',
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson() - "[]"',
        shouldRun: true,
    },
    {
        expected: true,
        input: [1, '', { x: [2] }],
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: "isJson() - [1, '', { x: [2] }]",
        shouldRun: true,
    },
    {
        expected: true,
        input: [],
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson() - []',
        shouldRun: true,
    },
    {
        expected: false,
        input: '1',
        testFn: function (input) { return JsonComparer_1.jsonComparer.isJSON(input); },
        label: 'isJson() - "1"',
        shouldRun: true,
    },
    {
        expected: false,
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
        },
        testFn: function (input) { return JsonComparer_1.jsonComparer.sameKeys(input.json1, input.json2); },
        label: 'sameKeys - for jsons with different keys',
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
            return JsonComparer_1.jsonComparer.isSubsetSpecialCases(input.json1, input.json2, ['x1', 'y'], [function (sub, sup) { return _.isEqual(sub.toLowerCase(), sup.toLowerCase()); }, function (sub, sup) { return JsonComparer_1.jsonComparer.sameKeys(sub, sup); }], ['x', 'y']);
        },
        label: 'isSubsetSpecialCases - is a subset check',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=JsonComparer.test.js.map