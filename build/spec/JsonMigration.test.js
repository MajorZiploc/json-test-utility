'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var testTools = require('../testTools');
var MigrationHandler_1 = require('../MigrationHandler');
var m = require('./JsonMigrators');
var testData = [
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
    testFn: function (input) {
      return MigrationHandler_1.migrationHandler.migrateJsons(input.startingJsons, input.migrators);
    },
    label: 'Checking migration cycle',
    shouldRun: true,
  },
];
testTools.tester(testData);
//# sourceMappingURL=JsonMigration.test.js.map
