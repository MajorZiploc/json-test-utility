import { jsonComparer as jc } from './../JsonComparer';
import { jsonRefactor as jr } from '../JsonRefactor';
import * as testTools from '../testTools';
import * as _ from 'lodash';

const testData: testTools.testInput[] = [
  {
    expected: ['super_pOweRful', 'super_pOweRful.PoWeRpOwEr', 'kind.plusultra.qq.power_slow_PoweR'],
    input: {
      json: {
        super_pOweRful: { PoWeRpOwEr: 1 },
        kind: { plusultra: { qq: { power_slow_PoweR: 1 } }, nothingCoolHere: { x: 1, y: 3, zzz: { zzzzz: { I: 9 } } } },
      },
      pattern: 'power',
      regexOptions: 'gi',
    },
    testFn: input => jc.findAllKeyPaths(input.json, input.pattern, input.regexOptions),
    label: 'findAllKeyPaths - that contain power with case insensitive and global flags',
    shouldRun: true,
  },
];

testTools.tester(testData);
