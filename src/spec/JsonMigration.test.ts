import * as testTools from '../testTools';
import { jsonMigration } from '../JsonMigration';
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
    testFn: input => jsonMigration.migrateJsons(input.startingJsons, input.migrators),
    label: 'Checking migration cycle',
    shouldRun: true,
  },
];

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
testTools.tester(testData);

// const testDataAsync: testTools.testInputAsync[] = [
//   {
//     label: 'Checks full migration lifecycle',
//     setup: async () => {
//       await fs.writeFile(__dirname + '/MigrationTestData/dev.json', JSON.stringify(dev, null, 2));
//       return await fs.writeFile(__dirname + '/MigrationTestData/dev2.json', JSON.stringify(dev2, null, 2));
//     },
//     cleanup: async () => {
//       await fs.remove(__dirname + '/MigrationTestData/dev.json');
//       return await fs.remove(__dirname + '/MigrationTestData/dev2.json');
//     },
//     asyncTestFn: async input => {
//       await migrationHandler.migrateFolder(
//         input.data,
//         [m.dateMigrator, m.nameMigrator].map(mi => ListOfJsonMigratorOf(mi)),
//         false
//       );
//       const actual = _.flatten(
//         await Promise.all(
//           [__dirname + '/MigrationTestData/dev.json', __dirname + '/MigrationTestData/dev2.json'].map(
//             async p => await fs.readJSON(p)
//           )
//         )
//       );
//       return actual;
//     },
//     input: { data: './src/spec/MigrationTestData' },
//     expected: [
//       {
//         status: 200,
//         date: '11-12-20',
//         name: 'Mr. Sir Jacoby Bryan',
//       },
//       {
//         status: 302,
//         date: '1-2-19',
//         name: 'James Yoyo',
//       },
//     ],
//   },
// ];
// testTools.testerAsync(testDataAsync);
