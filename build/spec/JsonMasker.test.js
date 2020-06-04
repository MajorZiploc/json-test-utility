"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonComparer_1 = require("./../JsonComparer");
var JsonMasker_1 = require("../JsonMasker");
var testTools = require("../testTools");
var _ = require("lodash");
var testData = [
    {
        expected: { name: 'James' },
        input: {
            json: { name: 'James' },
        },
        comparer: function (actual, expected) { return !_.isEqual(actual, expected) && JsonComparer_1.jsonComparer.sameKeys(actual, expected); },
        testFn: function (input) { return JsonMasker_1.jsonMasker.maskData(input.json); },
        label: 'maskData - Check that the masker returns different values but the same keys',
        shouldRun: true,
    },
    {
        expected: [{ name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } }, { x: 56 }],
        input: {
            json: [{ name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } }, { x: 56 }],
        },
        comparer: function (actual, expected) {
            var zl = _.zipWith(actual, expected, function (a, e) { return ({ a: a, e: e }); });
            var bool = zl.every(function (o) { return !_.isEqual(o.a, o.e) && JsonComparer_1.jsonComparer.sameKeys(o.a, o.e); });
            return bool;
        },
        testFn: function (input) { return JsonMasker_1.jsonMasker.maskData(input.json, { list: JsonMasker_1.DataMaskingStrategy.Identity }); },
        label: 'maskData - Check that the masker returns different values but the same keys',
        shouldRun: true,
    },
    {
        expected: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
        input: {
            json: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
        },
        comparer: function (actual, expected) { return !_.isEqual(actual, expected) && JsonComparer_1.jsonComparer.sameKeys(actual, expected); },
        testFn: function (input) { return JsonMasker_1.jsonMasker.maskData(input.json); },
        label: 'maskData - Check that the masker returns different values but the same keys',
        shouldRun: true,
    },
    {
        expected: {
            name: '           ',
            l: [{ x: 'l', y: 'oooooo' }, 11111, 333.333, -444],
            jj: { dateOne: '02/14/1246', dateTwo: '05-17-2020' },
        },
        input: {
            json: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
        },
        comparer: function (actual, expected) { return !_.isEqual(actual, expected) && JsonComparer_1.jsonComparer.sameKeys(actual, expected); },
        testFn: function (input) { return JsonMasker_1.jsonMasker.maskData(input.json); },
        label: 'maskData - Check that the masker returns different values but the same keys',
        shouldRun: true,
    },
    {
        expected: 'expected not used',
        input: {
            json: { x: [1, 'asdf', 45], y: { j: 4 }, joe: 44, sam: 'lamb' },
        },
        comparer: function (actual, expected, input) {
            var j = input.json;
            var a = actual;
            return j.x[0] === a.x[0] && j.x[1] !== a.x[1] && j.x[2] === a.x[2] && _.isEqual(j.y, a.y) && j.sam !== a.sam;
        },
        testFn: function (input) {
            return JsonMasker_1.jsonMasker.maskData(input.json, {
                overall: JsonMasker_1.DataMaskingStrategy.Scramble,
                number: JsonMasker_1.DataMaskingStrategy.Identity,
                list: JsonMasker_1.DataMaskingStrategy.Identity,
            });
        },
        label: 'maskData - Check that the masker returns different values but the same keys',
        shouldRun: true,
    },
    {
        expected: { x: true },
        input: {
            json: { x: false },
        },
        comparer: function (actual, expected) { return JsonComparer_1.jsonComparer.sameKeys(actual, expected) && typeof actual.x === typeof expected.x; },
        testFn: function (input) { return JsonMasker_1.jsonMasker.maskData(input.json); },
        label: 'maskData - bool scramble check',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=JsonMasker.test.js.map