"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMigrator = void 0;
var JsonRefactor_1 = require("./../../JsonRefactor");
var DateMigrator = /** @class */ (function () {
    function DateMigrator() {
    }
    DateMigrator.prototype.apply = function (json) {
        return JsonRefactor_1.jsonRefactor.setField(json, 'date', json.date.replace(/\//g, '-'));
    };
    DateMigrator.prototype.description = function () {
        return 'Converts / to - for the date field';
    };
    return DateMigrator;
}());
exports.dateMigrator = new DateMigrator();
//# sourceMappingURL=DateMigrator.js.map