"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonComparer_1 = require("./../JsonComparer");
var testTools = require("../testTools");
var testData = [
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
        testFn: function (input) { return JsonComparer_1.jsonComparer.findAllKeyPaths(input.json, input.pattern, input.regexOptions); },
        label: 'findAllKeyPaths - that contain power with case insensitive and global flags',
        shouldRun: true,
    },
];
testTools.tester(testData);
//# sourceMappingURL=JsonMasker.test.js.map