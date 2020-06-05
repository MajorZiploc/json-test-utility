import { jsonComparer as jc } from './../JsonComparer';
import { jsonRefactor as jr } from '../JsonRefactor';
import { jsonMasker as jmk, DataMaskingStrategy } from '../JsonMasker';
import * as testTools from '../testTools';
import * as _ from 'lodash';

const testData: testTools.testInput[] = [
  {
    expected: { name: 'James' },
    input: {
      json: { name: 'James' },
    },
    comparer: (actual: any, expected: any) => !_.isEqual(actual, expected) && jc.sameKeys(actual, expected),
    testFn: input => jmk.maskData(input.json),
    label: 'maskData - Check that the masker returns different values but the same keys',
    shouldRun: true,
  },
  {
    expected: [{ name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } }, { x: 56 }],
    input: {
      json: [{ name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } }, { x: 56 }],
    },
    comparer: (actual: any, expected: any) => {
      const zl = _.zipWith(actual, expected, (a, e) => ({ a, e }));
      const bool = zl.every(o => !_.isEqual(o.a, o.e) && jc.sameKeys(o.a, o.e));
      return bool;
    },
    testFn: input => jmk.maskData(input.json, { list: DataMaskingStrategy.Identity }),
    label: 'maskData - Check that the masker returns different values but the same keys',
    shouldRun: true,
  },
  {
    expected: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
    input: {
      json: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
    },
    comparer: (actual: any, expected: any) => !_.isEqual(actual, expected) && jc.sameKeys(actual, expected),
    testFn: input => jmk.maskData(input.json),
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
    comparer: (actual: any, expected: any) => !_.isEqual(actual, expected) && jc.sameKeys(actual, expected),
    testFn: input => jmk.maskData(input.json),
    label: 'maskData - Check that the masker returns different values but the same keys',
    shouldRun: true,
  },
  {
    expected: 'expected not used',
    input: {
      json: { x: [1, 'asdf', 45], y: { j: 4 }, joe: 44, sam: 'lamb' },
    },
    comparer: (actual: any, expected: any, input: any) => {
      const j = input.json;
      const a = actual;
      return j.x[0] === a.x[0] && j.x[1] !== a.x[1] && j.x[2] === a.x[2] && _.isEqual(j.y, a.y) && j.sam !== a.sam;
    },
    testFn: input =>
      jmk.maskData(input.json, {
        overall: DataMaskingStrategy.Scramble,
        number: DataMaskingStrategy.Identity,
        list: DataMaskingStrategy.Identity,
      }),
    label: 'maskData - Check that the masker returns different values but the same keys',
    shouldRun: true,
  },
  {
    expected: { x: true },
    input: {
      json: { x: false },
    },
    comparer: (actual: any, expected: any) => jc.sameKeys(actual, expected) && typeof actual.x === typeof expected.x,
    testFn: input => jmk.maskData(input.json),
    label: 'maskData - bool scramble check',
    shouldRun: true,
  },
  {
    expected: { x: true, l: [2, 3, 4, 5] },
    input: {
      json: { x: false, l: [1, 2, 3] },
    },
    comparer: (actual: any, expected: any) =>
      jc.sameKeys(actual, expected) && jc.sameTypes(actual, expected) && _.isEqual(actual, expected),
    testFn: input =>
      jmk.maskData(input.json, {
        list: l => {
          l.push(4);
          return l;
        },
        number: n => n + 1,
        boolean: b => !b,
      }),
    label: 'maskData - given user strategies',
    shouldRun: true,
  },
];

testTools.tester(testData);
