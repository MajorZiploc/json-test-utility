import * as test from 'tape-async';
import * as _ from 'lodash';

export function safeStringify(thing: any) {
  try {
    return JSON.stringify(thing);
  } catch (e) {
    return 'failed to stringify object.\nObject: ' + thing + '\nException: ' + e;
  }
}

export function reporter(actual: any, expected: any) {
  if (_.isEqual(actual, expected)) {
    return 'Actual and Expected are both equal to: ' + safeStringify(actual);
  }
  return 'Actual: ' + safeStringify(actual) + '\nExpected: ' + safeStringify(expected);
}

export interface testInput {
  label: string;
  input: any;
  expected: any;
  testFn?: (input: any) => any | Promise<any>;
  shouldRun?: boolean;
  comparer?: (actual: any, expected: any, input?: any) => boolean | Promise<boolean>;
  reporter?: (actual: any, expected: any, wasSuccessful: boolean, input?: any) => string | Promise<string>;
  setup?: () => any | Promise<any>;
  cleanup?: () => any | Promise<any>;
}

export function tester(testData: testInput[]) {
  if (testData.every(d => !(d.shouldRun ?? true))) {
    console.log('All test cases are marked as shouldRun=false!');
  }
  testData.forEach(d => {
    const shouldRun = d.shouldRun ?? true;
    const comparer = d.comparer ?? (async (a, e, _i) => _.isEqual(a, e));
    const testReporter = d.reporter ?? (async (a, e, _r, _i) => reporter(a, e));
    const tester = shouldRun ? test : test.skip;
    const setup = d.setup ?? (async () => {});
    const testFn = d.testFn ?? (async (input: any) => input);
    const cleanup = d.cleanup ?? (async () => {});
    tester(d.label, async t => {
      await setup();
      const input = await d.input;
      const actual = await testFn(input);
      const expected = await d.expected;
      const wasSuccessful = await comparer(actual, expected, input);
      t.true(wasSuccessful, await testReporter(actual, expected, wasSuccessful, input));
      await cleanup();
      t.end();
    });
  });
}

