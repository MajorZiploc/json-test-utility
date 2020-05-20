"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRefactor = void 0;
var _ = require("lodash");
var JsonComparer_1 = require("./JsonComparer");
var JsonRefactor = /** @class */ (function () {
    function JsonRefactor() {
    }
    JsonRefactor.prototype.copy = function (json) {
        return _.clone(json);
    };
    JsonRefactor.prototype.addField = function (json, key, value) {
        var r = this.copy(json);
        return _.set(r, key, value);
    };
    JsonRefactor.prototype.removeField = function (json, key) {
        var r = this.copy(json);
        _.unset(r, key);
        return r;
    };
    JsonRefactor.prototype.setField = function (json, key, value) {
        return this.addField(json, key, value);
    };
    JsonRefactor.prototype.sameKeys = function (json1, json2) {
        return JsonComparer_1.jsonComparer.isSubsetKeys(json1, json2) && JsonComparer_1.jsonComparer.isSubsetKeys(json2, json1);
    };
    JsonRefactor.prototype.subJson = function (json, keys) {
        return this.fromKeyValArray(this.toKeyValArray(json).filter(function (kv) { return keys.some(function (k) { return _.isEqual(k, kv.key); }); }));
    };
    JsonRefactor.prototype.subJsonExcept = function (json, keys) {
        return this.fromKeyValArray(this.toKeyValArray(json).filter(function (kv) { return !keys.some(function (k) { return _.isEqual(k, kv.key); }); }));
    };
    JsonRefactor.prototype.toKeyValArray = function (json) {
        return Object.entries(json).map(function (e) { return ({ key: e[0], value: e[1] }); });
    };
    JsonRefactor.prototype.fromKeyValArray = function (keyValueArray) {
        var _this = this;
        return keyValueArray.reduce(function (acc, ele) { return _this.addField(acc, ele.key, ele.value); }, {});
    };
    return JsonRefactor;
}());
exports.jsonRefactor = new JsonRefactor();
//# sourceMappingURL=JsonRefactor.js.map