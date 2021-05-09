"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testTools = require("../testTools");
var List_1 = require("../List");
var testData = [
    {
        expected: true,
        input: { l: [1, 2, 3] },
        testFn: function (input) {
            return List_1.list.isSorted(input.l);
        },
        label: 'list isSorted - true, [1,2,3]',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [1, 1, 1] },
        testFn: function (input) {
            return List_1.list.isSorted(input.l);
        },
        label: 'list isSorted - true, list of same eles',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [1, 1, 1] },
        testFn: function (input) {
            return List_1.list.isSortedDesc(input.l);
        },
        label: 'list isSortedDesc - true, list of same eles',
        shouldRun: true,
    },
    {
        expected: false,
        input: { l: [5, 2, 3] },
        testFn: function (input) {
            return List_1.list.isSorted(input.l);
        },
        label: 'list isSorted - false, [5,2,3]',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [1, 2, 3] },
        testFn: function (input) {
            return List_1.list.isSortedAsc(input.l);
        },
        label: 'list isSortedAsc - true, [1,2,3]',
        shouldRun: true,
    },
    {
        expected: false,
        input: { l: [5, 2, 3] },
        testFn: function (input) {
            return List_1.list.isSortedAsc(input.l);
        },
        label: 'list isSortedAsc - false, [5,2,3]',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [5, 4, 3] },
        testFn: function (input) {
            return List_1.list.isSortedDesc(input.l);
        },
        label: 'list isSortedDesc - false, [5,4,3]',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [] },
        testFn: function (input) {
            return List_1.list.isSorted(input.l);
        },
        label: 'list isSorted - true, []',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [] },
        testFn: function (input) {
            return List_1.list.isSortedAsc(input.l);
        },
        label: 'list isSortedAsc - true, []',
        shouldRun: true,
    },
    {
        expected: true,
        input: { l: [] },
        testFn: function (input) {
            return List_1.list.isSortedDesc(input.l);
        },
        label: 'list isSortedDesc - true, []',
        shouldRun: true,
    },
    {
        expected: true,
        input: {
            l: [
                { n: 1, l: 'pancakes' },
                { n: 2, l: 'zone cones' },
            ],
        },
        testFn: function (input) {
            return List_1.list.isSorted(input.l, function (f, s) { return f.n <= s.n; });
        },
        label: 'list isSorted - true, complex json structure sort by field n',
        shouldRun: true,
    },
    {
        expected: false,
        input: {
            l: [
                { n: 1, l: 'pancakes' },
                { n: 2, l: 'zone cones' },
            ],
        },
        testFn: function (input) {
            return List_1.list.isSorted(input.l, function (f, s) { return f.n >= s.n; });
        },
        label: 'list isSorted - false, complex json structure sort by field n',
        shouldRun: true,
    },
    {
        expected: true,
        input: {
            l: [
                { n: 1, l: 'pancakes' },
                { n: 2, l: 'zone cones' },
            ],
        },
        testFn: function (input) {
            return List_1.list.isSorted(input.l, function (f, s) { return f.l.localeCompare(s.l) <= 0; });
        },
        label: 'list isSorted - true, complex json structure sort by field l',
        shouldRun: true,
    },
    {
        expected: false,
        input: {
            l: [
                { n: 1, l: 'pancakes' },
                { n: 2, l: 'zone cones' },
            ],
        },
        testFn: function (input) {
            return List_1.list.isSorted(input.l, function (f, s) { return f.l.localeCompare(s.l) >= 0; });
        },
        label: 'list isSorted - false, complex json structure sort by field l',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=List.test.js.map