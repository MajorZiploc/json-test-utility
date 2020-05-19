"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRefactor = void 0;
var _ = require("lodash");
var JsonComparer_1 = require("./JsonComparer");
/**
 * A collection of ways to alter jsons.
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
        return JsonComparer_1.jsonComparer.isSubsetKeys(json1, json2) && JsonComparer_1.jsonComparer.isSubsetKeys(json2, json1);
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
exports.jsonRefactor = new JsonRefactor();
//# sourceMappingURL=JsonRefactor.js.map