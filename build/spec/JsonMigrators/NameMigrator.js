"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameMigrator = void 0;
var JsonRefactor_1 = require("./../../JsonRefactor");
var NameMigrator = /** @class */ (function () {
    function NameMigrator() {
    }
    NameMigrator.prototype.apply = function (json) {
        var subJson = JsonRefactor_1.jsonRefactor.subJson(json, ['status', 'date']);
        return JsonRefactor_1.jsonRefactor.addField(subJson, 'name', (json.prefix.length == 0 ? '' : json.prefix + ' ') + json.firstName + ' ' + json.lastName);
    };
    NameMigrator.prototype.description = function () {
        return 'places all name fields into one field';
    };
    return NameMigrator;
}());
exports.nameMigrator = new NameMigrator();
//# sourceMappingURL=NameMigrator.js.map