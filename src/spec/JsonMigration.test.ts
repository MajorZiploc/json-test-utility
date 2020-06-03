import * as testTools from '../testTools';
import { migrationHandler } from '../MigrationHandler';
import * as _ from 'lodash';
import * as m from './JsonMigrators';
import { ListOfJsonMigratorOf } from './../ListOfJsonMigrator';
import * as test from 'tape-catch';
import * as fs from 'fs-extra';

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
test('Check full json migration lifecycle', async t => {
  const data = './src/spec/MigrationTestData';
  const dev = [
    {
      status: 200,
      date: '11/12/20',
      prefix: 'Mr. Sir',
      firstName: 'Jacoby',
      lastName: 'Bryan',
    },
  ];

  const dev2 = [
    {
      status: 302,
      date: '1/2/19',
      prefix: '',
      firstName: 'James',
      lastName: 'Yoyo',
    },
  ];
  await fs.writeFile(__dirname + '/MigrationTestData/dev.json', JSON.stringify(dev, null, 2));
  await fs.writeFile(__dirname + '/MigrationTestData/dev2.json', JSON.stringify(dev2, null, 2));
  await migrationHandler.migrateFolder(
    data,
    [m.dateMigrator, m.nameMigrator].map(mi => ListOfJsonMigratorOf(mi)),
    false
  );
  const expected = [
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
  ];
  const actual = _.flatten(
    await Promise.all(
      [__dirname + '/MigrationTestData/dev.json', __dirname + '/MigrationTestData/dev2.json'].map(
        async p => await fs.readJSON(p)
      )
    )
  );
  t.true(_.isEqual(actual, expected), testTools.reporter(actual, expected));
  await fs.writeFile(__dirname + '/MigrationTestData/dev.json', JSON.stringify(dev, null, 2));
  await fs.writeFile(__dirname + '/MigrationTestData/dev2.json', JSON.stringify(dev2, null, 2));
  t.end();
});
