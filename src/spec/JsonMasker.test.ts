import { jsonComparer as jc } from './../JsonComparer';
import { jsonRefactor as jr } from '../JsonRefactor';
import { jsonMasker as jmk } from '../JsonMasker';
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
    testFn: input => jmk.maskData(input.json),
    label: 'maskData - Check that the masker returns different values but the same keys',
    shouldRun: false,
  },
  {
    expected: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
    input: {
      json: { name: 'James123 asd f', l: [{ x: 'lol' }, 1, 3], jj: { cotton: 'candy' } },
    },
    comparer: (actual: any, expected: any) => !_.isEqual(actual, expected) && jc.sameKeys(actual, expected),
    testFn: input => jmk.maskData(input.json),
    label: 'maskData - Check that the masker returns different values but the same keys',
    shouldRun: false,
  },
];

testTools.tester(testData);
