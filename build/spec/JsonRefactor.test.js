"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonRefactor_1 = require("../JsonRefactor");
var JsonComparer_1 = require("../JsonComparer");
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
        input: { x: 12, y: { g: 'ba' }, z: [1, 2, 3] },
        testFn: function (input) {
            var actual = JsonRefactor_1.jsonRefactor.toKeyValArray(input);
            var expected = [
                { key: 'x', value: 12 },
                { key: 'y', value: { g: 'ba' } },
                { key: 'z', value: [1, 2, 3] },
            ];
            return JsonComparer_1.jsonComparer.containSameElements(actual, expected);
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
    {
        expected: { x: 1, y: 2, z: { zz: [1, 2, 3, {}, [], ''] } },
        input: { json1: { x: 1, y: 2 }, json2: { z: { zz: [1, 2, 3, {}, [], ''] } } },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.concatJsons(input.json1, input.json2); },
        label: 'concatJsons - happy path',
        shouldRun: true,
    },
    {
        expected: 'The two jsons that are being combined have keys in common.\nCommon keys:\nx\nz',
        input: { json1: { x: 1, y: 2, z: 234 }, json2: { x: {}, z: { zz: [1, 2, 3, {}, [], ''] } } },
        testFn: function (input) {
            try {
                JsonRefactor_1.jsonRefactor.concatJsons(input.json1, input.json2);
                return 'Should not get here!';
            }
            catch (e) {
                return e.message;
            }
        },
        label: 'concatJsons - error path',
        shouldRun: true,
    },
    {
        expected: { y: 2, z: 4 },
        input: { json1: { x: 1, y: 2, z: 4, a: { xa: ['', {}] } }, json2: { a: 3, x: [] } },
        testFn: function (input) { return JsonRefactor_1.jsonRefactor.minusJsons(input.json1, input.json2); },
        label: 'minusJsons',
        shouldRun: true,
    },
    ,
];
testTools.tester(testData);
//# sourceMappingURL=JsonRefactor.test.js.map