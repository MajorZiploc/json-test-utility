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
    },
    {
        expected: 'input',
        input: { dsf: [], food: 'truck' },
        testFn: function (input) {
            return Variable_1.variable.toString({ input: input });
        },
        label: 'toString: variable input should yield "input"',
    },
];
testTools.tester(testData);
//# sourceMappingURL=Variable.test.js.map