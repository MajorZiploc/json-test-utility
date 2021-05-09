"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOfJsonMigratorOf = void 0;
var ListOfJsonMigrator = /** @class */ (function () {
    function ListOfJsonMigrator(jsonMigrator) {
        this.jsonMigrator = jsonMigrator;
    }
    ListOfJsonMigrator.prototype.apply = function (jsons) {
        return jsons.map(this.jsonMigrator.apply);
    };
    ListOfJsonMigrator.prototype.description = function () {
        return this.jsonMigrator.description();
    };
    return ListOfJsonMigrator;
}());
function ListOfJsonMigratorOf(eleMigrator) {
    return new ListOfJsonMigrator(eleMigrator);
}
exports.ListOfJsonMigratorOf = ListOfJsonMigratorOf;
//# sourceMappingURL=ListOfJsonMigrator.js.map