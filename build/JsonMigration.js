"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonMigration = void 0;
var JsonMigration = /** @class */ (function () {
    function JsonMigration() {
    }
    /**
     *
     * This operation in immutable
     *
     *
     * @param jsons - list of jsons to migrate
     * @param migrators
     *  list of migrators that take old jsons and create new jsons based on them.
     *  its an order list where the created json of one migrator becomes the old json/input of the next
     */
    JsonMigration.prototype.migrateJsons = function (jsons, migrators) {
        var migratedJsons = jsons.map(function (json) { return migrators.reduce(function (acc, m) { return m.apply(acc); }, json); });
        return migratedJsons;
    };
    return JsonMigration;
}());
exports.jsonMigration = new JsonMigration();
//# sourceMappingURL=JsonMigration.js.map