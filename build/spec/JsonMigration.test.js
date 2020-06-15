"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testTools = require("../testTools");
var JsonMigration_1 = require("../JsonMigration");
var m = require("./JsonMigrators");
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
        testFn: function (input) { return JsonMigration_1.jsonMigration.migrateJsons(input.startingJsons, input.migrators); },
        label: 'Checking migration cycle',
        shouldRun: true,
    },
];
var dev = [
    {
        status: 200,
        date: '11/12/20',
        prefix: 'Mr. Sir',
        firstName: 'Jacoby',
        lastName: 'Bryan',
    },
];
var dev2 = [
    {
        status: 302,
        date: '1/2/19',
        prefix: '',
        firstName: 'James',
        lastName: 'Yoyo',
    },
];
testTools.tester(testData);
var testDataAsync = [
    {
        label: 'Checks full migration lifecycle',
        setup: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.writeFile(__dirname + '/MigrationTestData/dev.json', JSON.stringify(dev, null, 2))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.writeFile(__dirname + '/MigrationTestData/dev2.json', JSON.stringify(dev2, null, 2))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        cleanup: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.remove(__dirname + '/MigrationTestData/dev.json')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.remove(__dirname + '/MigrationTestData/dev2.json')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        asyncTestFn: function (input) { return __awaiter(void 0, void 0, void 0, function () {
            var actual, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, MigrationHandler_1.migrationHandler.migrateFolder(input.data, [m.dateMigrator, m.nameMigrator].map(function (mi) { return ListOfJsonMigrator_1.ListOfJsonMigratorOf(mi); }), false)];
                    case 1:
                        _c.sent();
                        _b = (_a = _).flatten;
                        return [4 /*yield*/, Promise.all([__dirname + '/MigrationTestData/dev.json', __dirname + '/MigrationTestData/dev2.json'].map(function (p) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs.readJSON(p)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 2:
                        actual = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, actual];
                }
            });
        }); },
        input: { data: './src/spec/MigrationTestData' },
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
    },
];
// testTools.testerAsync(testDataAsync);
//# sourceMappingURL=JsonMigration.test.js.map