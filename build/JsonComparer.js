"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonComparer = void 0;
var _ = require("lodash");
var JsonRefactor_1 = require("./JsonRefactor");
var JsonComparer = /** @class */ (function () {
    function JsonComparer() {
    }
    JsonComparer.prototype.isSubsetWith = function (subJson, superJson, compareFn) {
        var subKVA = JsonRefactor_1.jsonRefactor.toKeyValArray(subJson);
        var superKVA = JsonRefactor_1.jsonRefactor.toKeyValArray(superJson);
        return subKVA.every(function (subKv) { return superKVA.some(function (supKv) { return compareFn(subKv, supKv); }); });
    };
    JsonComparer.prototype.isSubset = function (subJson, superJson) {
        return this.isSubsetWith(subJson, superJson, _.isEqual);
    };
    JsonComparer.prototype.isSubsetKeys = function (subJson, superJson) {
        return this.isSubsetWith(subJson, superJson, function (sub, sup) { return _.isEqual(sub.key, sup.key); });
    };
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
    JsonComparer.prototype.isSubsetArrayWith = function (subArray, superArray, comparer) {
        return subArray.every(function (subV) { return superArray.some(function (supV) { return comparer(subV, supV); }); });
    };
    JsonComparer.prototype.isSubsetArray = function (subArray, superArray) {
        return this.isSubsetArrayWith(subArray, superArray, _.isEqual);
    };
    JsonComparer.prototype.containSameElementsWith = function (array1, array2, comparer) {
        return this.isSubsetArrayWith(array1, array2, comparer) && this.isSubsetArrayWith(array1, array2, comparer);
    };
    JsonComparer.prototype.containSameElements = function (array1, array2) {
        return this.containSameElementsWith(array1, array2, _.isEqual);
    };
    return JsonComparer;
}());
exports.jsonComparer = new JsonComparer();
//# sourceMappingURL=JsonComparer.js.map