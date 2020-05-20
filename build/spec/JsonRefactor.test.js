"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonRefactor_1 = require("../JsonRefactor");
var testTools = require("../testTools");
var _ = require("lodash");
var testData = [
    {
        expected: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
        input: { status: 200, e: 'jones' },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.addField(input, 'j.i', { k: [{ x: 1 }, 1] }); },
        label: 'AddField',
        shouldRun: true,
    },
    {
        expected: { status: 200, e: 300 },
        input: { status: 200, e: 'jones' },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.setField(input, 'e', 300); },
        label: 'SetField',
        shouldRun: true,
    },
    {
        expected: { status: 200, e: 'jones', j: { i: {} } },
        input: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.removeField(input, 'j.i.k'); },
        label: 'RemoveField',
        shouldRun: true,
    },
    {
        expected: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
        input: { status: 200, e: 'jones', j: { i: { k: [{ x: 1 }, 1] } } },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.copy(input); },
        label: 'Copy',
        shouldRun: true,
    },
    {
        expected: true,
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 'asdffd', y: { fdsa: 1 } },
        },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.sameKeys(input.json1, input.json2); },
        label: 'sameKeys - for jsons with same keys',
        shouldRun: true,
    },
    {
        expected: false,
        input: {
            json1: { x: 123, y: { z: 1 } },
            json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
        },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.sameKeys(input.json1, input.json2); },
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
        testFn: function (input) {
            var actual = JsonRefactor_1.jsonRefactor.fromKeyValArray(input);
            var expected = { x: 12, y: { g: 'ba' }, z: [1, 2, 3] };
            return _.isEqual(actual, expected);
        },
        label: 'fromKeyValArray',
        shouldRun: true,
    },
    {
        expected: { x: 1 },
        input: { x: 1, y: 2, z: 3 },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.subJsonExcept(input, ['y', 'z']); },
        label: 'subJsonExcept',
        shouldRun: true,
    },
    {
        expected: { y: 2, z: 3 },
        input: { x: 1, y: 2, z: 3 },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.subJson(input, ['y', 'z']); },
        label: 'subJson',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=JsonRefactor.test.js.map