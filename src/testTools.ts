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
  shouldRun?: boolean;
  comparer?: (actual: any, expected: any, input?: any) => boolean;
  reporter?: (actual: any, expected: any, input?: any) => string;
  setup?: () => void;
  cleanup?: () => void;
}

export interface testInputAsync {
  expected: any;
  input: any;
  asyncTestFn: (input: any) => Promise<any>;
  label: string;
  shouldRun?: boolean;
  comparer?: (actual: any, expected: any, input?: any) => boolean;
  reporter?: (actual: any, expected: any, input?: any) => string;
  setup?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

export function tester(testData: testInput[]) {
  if (testData.every(d => !(d.shouldRun ?? true))) {
    console.log('All test cases are marked as shouldRun=false!');
  }
  testData.forEach(d => {
    const shouldRun = d.shouldRun ?? true;
    const comparer = d.comparer ?? ((a, e, i) => _.isEqual(a, e));
    const testReporter = d.reporter ?? ((a, e, i) => reporter(a, e));
    const tester = shouldRun ? test : test.skip;
    const setup = d.setup ?? (() => {});
    const cleanup = d.cleanup ?? (() => {});
    tester(d.label, t => {
      setup();
      const input = d.input;
      const actual = d.testFn(input);
      const expected = d.expected;
      t.true(comparer(actual, expected, input), testReporter(actual, expected, input));
      cleanup();
      t.end();
    });
  });
}

export function testerAsync(testData: testInputAsync[]) {
  if (testData.every(d => !(d.shouldRun ?? true))) {
    console.log('All test cases are marked as shouldRun=false!');
  }
  testData.forEach(d => {
    const shouldRun = d.shouldRun ?? true;
    const comparer = d.comparer ?? ((a, e, i) => _.isEqual(a, e));
    const testReporter = d.reporter ?? ((a, e, i) => reporter(a, e));
    const tester = shouldRun ? test : test.skip;
    const setup = d.setup ?? (async () => {});
    const cleanup = d.cleanup ?? (async () => {});
    tester(d.label, async t => {
      await setup();
      const input = d.input;
      const actual = await d.asyncTestFn(input);
      const expected = d.expected;
      t.true(comparer(actual, expected, input), testReporter(actual, expected, input));
      await cleanup();
      t.end();
    });
  });
}
