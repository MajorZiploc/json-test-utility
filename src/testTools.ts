import * as test from 'tape-catch';
import * as _ from 'lodash';

export function safeStringify(thing) {
  try {
    return JSON.stringify(thing);
  } catch (e) {
    return 'failed to stringify object.\nObject: ' + thing + '\nException: ' + e;
  }
}

export function reporter(actual, expected) {
  if (_.isEqual(actual, expected)) {
    return 'Actual and Expected are both equal to: ' + safeStringify(actual);
  }
  return 'Actual: ' + safeStringify(actual) + '\nExpected: ' + safeStringify(expected);
}

export interface testInput {
  expected: any;
  input: any;
  testFn: (input: any) => any;
  label: string;
  shouldRun: boolean;
}

export function tester(testData: testInput[]) {
  testData.forEach(d => {
    const tester = d.shouldRun ? test : test.skip;
    tester(d.label, t => {
      const data = d.input;
      const dataCopy = _.clone(data);
      const actual = d.testFn(data);
      const expected = d.expected;
      t.true(_.isEqual(actual, expected), reporter(actual, expected));
      const isImmutable = _.isEqual(data, dataCopy);
      t.true(isImmutable, 'Checking that the input data was not changed.');
      t.end();
    });
  });
}

export function testerAsync(testData: testInput[]) {
  testData.forEach(d => {
    const tester = d.shouldRun ? test : test.skip;
    tester(d.label, async t => {
      const data = d.input;
      const dataCopy = _.clone(data);
      const actual = await d.testFn(data);
      const expected = d.expected;
      t.true(_.isEqual(actual, expected), reporter(actual, expected));
      const isImmutable = _.isEqual(data, dataCopy);
      t.true(isImmutable, 'Checking that the input data was not changed.');
      t.end();
    });
  });
}
