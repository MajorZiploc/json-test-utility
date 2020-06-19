"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testTools = require("../testTools");
var Variable_1 = require("./../Variable");
var testData = [
    {
        expected: 'x',
        input: {},
        testFn: function (input) {
            var x = 'sweet';
            return Variable_1.variable.toString({ x: x });
        },
        label: 'toString: variable x should yield "x"',
        shouldRun: true,
    },
    {
        expected: 'input',
        input: { dsf: [], food: 'truck' },
        testFn: function (input) {
            return Variable_1.variable.toString({ input: input });
        },
        label: 'toString: variable input should yield "input"',
        shouldRun: true,
    },
    {
        expected: 'input',
        input: { dsf: [], food: 'truck' },
        testFn: function (input) {
            return Variable_1.variable.splitCamelCase({ input: input });
        },
        label: 'splitCamelCase: variable input should yield "input"',
        shouldRun: true,
    },
    {
        expected: 'extr3m3 Camel Casist4 You Swe3tie',
        input: { dsf: [], food: 'truck' },
        testFn: function (input) {
            var extr3m3CamelCasist4YouSwe3tie = 1;
            return Variable_1.variable.splitCamelCase({ extr3m3CamelCasist4YouSwe3tie: extr3m3CamelCasist4YouSwe3tie });
        },
        label: 'splitCamelCase: variable input should yield "input"',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=Variable.test.js.map