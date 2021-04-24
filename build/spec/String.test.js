"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testTools = require("../testTools");
var String_1 = require("./../String");
var testData = [
    {
        expected: 'x',
        input: {},
        testFn: function (input) {
            return String_1.string.splitCamelCase('x');
        },
        label: 'splitCamelCase: s x should yield "x"',
        shouldRun: true,
    },
    {
        expected: 'extr3m3<:>Camel<:>Casist4<:>You<:>Swe3tie',
        input: { str: 'extr3m3CamelCasist4YouSwe3tie', separator: '<:>' },
        testFn: function (input) {
            return String_1.string.splitCamelCase(input.str, input.separator);
        },
        label: 'splitCamelCase: s extr3m3CamelCasist4YouSwe3tie with separator <:>, should yield "extr3m3<:>Camel<:>Casist4<:>You<:>Swe3tie"',
        shouldRun: true,
    },
    {
        expected: null,
        input: null,
        testFn: function (input) {
            return String_1.string.splitCamelCase(input);
        },
        label: 'splitCamelCase: null case',
        shouldRun: true,
    },
    {
        expected: 'In The W0rds 0f Th3 Wis3',
        input: 'iN thE W0rDs 0F TH3 wis3',
        testFn: function (input) {
            return String_1.string.titleCase(input);
        },
        label: "titleCase: s 'iN thE W0rDs 0F TH3 wis3' should yield 'In The W0rds 0f Th3 Wis3'",
        shouldRun: true,
    },
    {
        expected: 'X',
        input: 'x',
        testFn: function (input) {
            return String_1.string.titleCase(input);
        },
        label: "titleCase: s 'x' should yield 'X'",
        shouldRun: true,
    },
    {
        expected: '',
        input: '',
        testFn: function (input) {
            return String_1.string.titleCase(input);
        },
        label: 'titleCase: empty s',
        shouldRun: true,
    },
    {
        expected: null,
        input: null,
        testFn: function (input) {
            return String_1.string.titleCase(input);
        },
        label: 'titleCase: null case',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=String.test.js.map