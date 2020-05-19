import * as testTools from '../testTools';
import { migrationHandler } from '../MigrationHandler';
import * as _ from 'lodash';
import * as m from './JsonMigrators';

const testData: testTools.testInput[] = [
  {
    expected: [
      {
        status: 200,
        date: '11-12-20',
        name: 'Mr. Sir Jacoby Bryan',
      },
      {
        status: 302,
        date: '1-2-19',
        name: 'James Yoyo',
      },
    ],
    input: {
      startingJsons: [
        {
          status: 200,
          date: '11/12/20',
          prefix: 'Mr. Sir',
          firstName: 'Jacoby',
          lastName: 'Bryan',
        },
        {
          status: 302,
          date: '1/2/19',
          prefix: '',
          firstName: 'James',
          lastName: 'Yoyo',
        },
      ],
      migrators: [m.dateMigrator, m.nameMigrator],
    },
    testFn: input => migrationHandler.migrateJsons(input.startingJsons, input.migrators),
    label: 'Checking migration cycle',
    shouldRun: true,
  },
];

testTools.tester(testData);
