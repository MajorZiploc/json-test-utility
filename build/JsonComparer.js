"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonComparer = void 0;
var _ = require("lodash");
var JsonRefactor_1 = require("./JsonRefactor");
/**
 * A collection of ways to compare jsons.
 */
var JsonComparer = /** @class */ (function () {
    function JsonComparer() {
    }
    JsonComparer.prototype.isSubsetGeneral = function (subJson, superJson, compareFn) {
        var subKVA = JsonRefactor_1.jsonRefactor.toKeyValArray(subJson);
        var superKVA = JsonRefactor_1.jsonRefactor.toKeyValArray(superJson);
        return subKVA.every(function (subKv) { return superKVA.some(function (supKv) { return compareFn(subKv, supKv); }); });
    };
    /**
     * Check if a json is a subset of another json.
     *
     * @param subJson
     * @param superJson
     */
    JsonComparer.prototype.isSubset = function (subJson, superJson) {
        return this.isSubsetGeneral(subJson, superJson, _.isEqual);
    };
    /**
     * Check if a json is a subset of another json based on keys
     *
     * @param subJson
     * @param superJson
     */
    JsonComparer.prototype.isSubsetKeys = function (subJson, superJson) {
        return this.isSubsetGeneral(subJson, superJson, function (sub, sup) { return _.isEqual(sub.key, sup.key); });
    };
    /**
     *
     * json subset check with extra flexiablity.
     *
     * @param subJson
     * @param superJson
     * @param specialSubKeys
     *  (Ordered List) Keys from the subset json that will be compared in a special way.
     * @param specialFns
     *  (Ordered List) The special way in which special subset and superset json values will be compared.
     * @param specialSuperKeys
     *  (Ordered List) Keys from the subset json that will be compared in a special way.
     * @param compareRest
     *  A flag that states if the rest (non special) of the values in the json should be compared based on strict equalivence
     */
    JsonComparer.prototype.isSubsetSpecialCases = function (subJson, superJson, specialSubKeys, specialFns, specialSuperKeys, compareRest) {
        if (specialSuperKeys === void 0) { specialSuperKeys = specialSubKeys; }
        if (compareRest === void 0) { compareRest = true; }
        var specialEntries = _.zipWith(specialSubKeys, specialSuperKeys, specialFns, function (subKey, superKey, fn) { return ({ subKey: subKey, superKey: superKey, fn: fn }); });
        var didSpecialsPass = specialEntries.every(function (e) { return e.fn(subJson[e.subKey], superJson[e.superKey]); });
        if (!didSpecialsPass) {
            return didSpecialsPass;
        }
        if (compareRest) {
            var stdSubEntries = JsonRefactor_1.jsonRefactor.toKeyValArray(JsonRefactor_1.jsonRefactor.subJsonExcept(subJson, specialSubKeys));
            var stdSupEntries = JsonRefactor_1.jsonRefactor.toKeyValArray(JsonRefactor_1.jsonRefactor.subJsonExcept(superJson, specialSuperKeys));
            return didSpecialsPass && this.isSubset(stdSubEntries, stdSupEntries);
        }
        return didSpecialsPass;
    };
    /**
     * Ignores order.
     *
     * Checks if all elements from the subset array exist in the super set array.
     *
     * @param subArray
     * @param superArray
     */
    JsonComparer.prototype.isSubsetArray = function (subArray, superArray) {
        return subArray.every(function (subV) { return superArray.some(function (supV) { return _.isEqual(subV, supV); }); });
    };
    /**
     * Ignores order.
     *
     * Checks if all elements of the first array exist in the second array and
     * Checks if all elements from the second array exist in the first array.
     *
     * @param array1
     * @param array2
     */
    JsonComparer.prototype.containSameElements = function (array1, array2) {
        return this.isSubsetArray(array1, array2) && this.isSubsetArray(array1, array2);
    };
    return JsonComparer;
}());
exports.jsonComparer = new JsonComparer();
//# sourceMappingURL=JsonComparer.js.map