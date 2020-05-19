"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jr = void 0;
var _ = require("lodash");
/**
 * A collection of ways to alter and compare jsons.
 */
var JsonRefactor = /** @class */ (function () {
    function JsonRefactor() {
    }
    /**
     * Create a copy of a json
     *
     * @param json
     */
    JsonRefactor.prototype.copy = function (json) {
        return _.clone(json);
    };
    /**
     * Adds a field to a json. Can also be used to set a field.
     *
     * @param json
     * @param key
     * @param value
     */
    JsonRefactor.prototype.addField = function (json, key, value) {
        var r = this.copy(json);
        return _.set(r, key, value);
    };
    /**
     * Removes a field from a json.
     *
     * @param json
     * @param key
     */
    JsonRefactor.prototype.removeField = function (json, key) {
        var r = this.copy(json);
        _.unset(r, key);
        return r;
    };
    /**
     * Sets a field in a json. Can also be used to add a field.
     *
     * @param json
     * @param key
     * @param value
     */
    JsonRefactor.prototype.setField = function (json, key, value) {
        return this.addField(json, key, value);
    };
    /**
     * Compares 2 jsons based on keys alone.
     *
     * @param json1
     * @param json2
     */
    JsonRefactor.prototype.sameKeys = function (json1, json2) {
        return this.isSubsetKeys(json1, json2) && this.isSubsetKeys(json2, json1);
    };
    JsonRefactor.prototype.isSubsetGeneral = function (subJson, superJson, compareFn) {
        var subKVA = this.toKeyValArray(subJson);
        var superKVA = this.toKeyValArray(superJson);
        return subKVA.every(function (subKv) { return superKVA.some(function (supKv) { return compareFn(subKv, supKv); }); });
    };
    /**
     * Check if a json is a subset of another json.
     *
     * @param subJson
     * @param superJson
     */
    JsonRefactor.prototype.isSubset = function (subJson, superJson) {
        return this.isSubsetGeneral(subJson, superJson, _.isEqual);
    };
    /**
     * Check if a json is a subset of another json based on keys
     *
     * @param subJson
     * @param superJson
     */
    JsonRefactor.prototype.isSubsetKeys = function (subJson, superJson) {
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
    JsonRefactor.prototype.isSubsetSpecialCases = function (subJson, superJson, specialSubKeys, specialFns, specialSuperKeys, compareRest) {
        if (specialSuperKeys === void 0) { specialSuperKeys = specialSubKeys; }
        if (compareRest === void 0) { compareRest = true; }
        var specialEntries = _.zipWith(specialSubKeys, specialSuperKeys, specialFns, function (subKey, superKey, fn) { return ({ subKey: subKey, superKey: superKey, fn: fn }); });
        var didSpecialsPass = specialEntries.every(function (e) { return e.fn(subJson[e.subKey], superJson[e.superKey]); });
        if (!didSpecialsPass) {
            return didSpecialsPass;
        }
        if (compareRest) {
            var stdSubEntries = this.toKeyValArray(this.subJsonExcept(subJson, specialSubKeys));
            var stdSupEntries = this.toKeyValArray(this.subJsonExcept(superJson, specialSuperKeys));
            return didSpecialsPass && this.isSubset(stdSubEntries, stdSupEntries);
        }
        return didSpecialsPass;
    };
    /**
     * Creates a subset json based on what keys you want to keep from the original json.
     *
     * @param json
     * @param keys
     */
    JsonRefactor.prototype.subJson = function (json, keys) {
        return this.fromKeyValArray(this.toKeyValArray(json).filter(function (kv) { return keys.some(function (k) { return _.isEqual(k, kv.key); }); }));
    };
    /**
     * Ignores order.
     *
     * Checks if all elements from the subset array exist in the super set array.
     *
     * @param subArray
     * @param superArray
     */
    JsonRefactor.prototype.isSubsetArray = function (subArray, superArray) {
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
    JsonRefactor.prototype.containSameElements = function (array1, array2) {
        return this.isSubsetArray(array1, array2) && this.isSubsetArray(array1, array2);
    };
    /**
     * Creates a subset json based on what keys you want to exclude from the original json.
     *
     * @param json
     * @param keys
     */
    JsonRefactor.prototype.subJsonExcept = function (json, keys) {
        return this.fromKeyValArray(this.toKeyValArray(json).filter(function (kv) { return !keys.some(function (k) { return _.isEqual(k, kv.key); }); }));
    };
    /**
     * Converts a json to a key value json pair list
     *
     * @param json
     */
    JsonRefactor.prototype.toKeyValArray = function (json) {
        return Object.entries(json).map(function (e) { return ({ key: e[0], value: e[1] }); });
    };
    /**
     * Converts a key value json pair list to a json
     *
     * @param keyValueArray
     */
    JsonRefactor.prototype.fromKeyValArray = function (keyValueArray) {
        var _this = this;
        return keyValueArray.reduce(function (acc, ele) { return _this.addField(acc, ele.key, ele.value); }, {});
    };
    return JsonRefactor;
}());
exports.jr = new JsonRefactor();
//# sourceMappingURL=JsonRefactor.js.map