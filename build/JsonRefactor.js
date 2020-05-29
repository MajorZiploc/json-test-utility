"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRefactor = void 0;
var _ = require("lodash");
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
    JsonRefactor.prototype.subJson = function (json, keys) {
        return this.fromKeyValArray(this.toKeyValArray(json).filter(function (kv) { return keys.some(function (k) { return _.isEqual(k, kv.key); }); }));
    };
    JsonRefactor.prototype.subJsonExcept = function (json, keys) {
        return this.fromKeyValArray(this.toKeyValArray(json).filter(function (kv) { return !keys.some(function (k) { return _.isEqual(k, kv.key); }); }));
    };
    JsonRefactor.prototype.toKeyValArray = function (json) {
        return Object.keys(json).map(function (key) { return ({ key: key, value: json[key] }); });
    };
    JsonRefactor.prototype.fromKeyValArray = function (keyValueArray) {
        var _this = this;
        return keyValueArray.reduce(function (acc, ele) { return _this.addField(acc, ele.key, ele.value); }, {});
    };
    JsonRefactor.prototype.concatJsons = function (json1, json2) {
        var kva1 = this.toKeyValArray(json1);
        var kva2 = this.toKeyValArray(json2);
        var joinedKVA = kva1.concat(kva2);
        var groupedByKey = _.groupBy(joinedKVA, function (kv) { return kv.key; });
        var duppedEntries = this.toKeyValArray(groupedByKey).filter(function (g) { return g.value.length > 1; });
        if (duppedEntries.length > 0) {
            throw new Error('The two jsons that are being combined have keys in common.\nCommon keys:\n' +
                duppedEntries.map(function (e) { return e.key; }).join('\n'));
        }
        else {
            return this.fromKeyValArray(joinedKVA);
        }
    };
    JsonRefactor.prototype.minusJsons = function (json1, json2) {
        var kva1 = this.toKeyValArray(json1);
        var kva2 = this.toKeyValArray(json2);
        var filteredKVA1 = kva1.filter(function (kv1) { return !kva2.some(function (kv2) { return _.isEqual(kv1.key, kv2.key); }); });
        return this.fromKeyValArray(filteredKVA1);
    };
    return JsonRefactor;
}());
exports.jsonRefactor = new JsonRefactor();
//# sourceMappingURL=JsonRefactor.js.map