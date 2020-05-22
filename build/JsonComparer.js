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
    JsonComparer.prototype.sameKeys = function (json1, json2) {
        return this.isSubsetKeys(json1, json2) && this.isSubsetKeys(json2, json1);
    };
    JsonComparer.prototype.isJSON = function (thing) {
        var m = thing;
        if (typeof m == 'object') {
            try {
                m = JSON.stringify(m);
            }
            catch (err) {
                return false;
            }
        }
        if (typeof m == 'string') {
            try {
                m = JSON.parse(m);
            }
            catch (err) {
                return false;
            }
        }
        if (typeof m != 'object') {
            return false;
        }
        return true;
    };
    JsonComparer.prototype.findAllKeyPaths = function (json, regexKeyPattern, regexOptions, deepCheck) {
        var isJson = this.isJSON.bind(this);
        var shouldRecur = deepCheck !== null && deepCheck !== void 0 ? deepCheck : true;
        var regex = regexOptions == null ? new RegExp(regexKeyPattern) : new RegExp(regexKeyPattern, regexOptions);
        function findAllHelper(json, currentPath, isJson) {
            var kva = JsonRefactor_1.jsonRefactor.toKeyValArray(json);
            var currentPathStr = currentPath == null ? '' : currentPath + '.';
            // check root keys of the json for matches
            var shallowKeyPaths = kva.filter(function (kv) { return kv.key.match(regex); }).map(function (kv) { return currentPathStr + kv.key; });
            // check values for jsons
            var deepPaths = shouldRecur
                ? _.flatten(kva.filter(function (kv) { return isJson(kv.value); }).map(function (kv) { return findAllHelper(kv.value, currentPathStr + kv.key, isJson); }))
                : [];
            return shallowKeyPaths.concat(deepPaths);
        }
        return _.flatten(JsonRefactor_1.jsonRefactor
            .toKeyValArray(_.groupBy(findAllHelper(json, null, isJson), function (s) { return s.split('.').length; }))
            .map(function (kv) { return kv.value.sort(); }));
    };
    return JsonComparer;
}());
exports.jsonComparer = new JsonComparer();
//# sourceMappingURL=JsonComparer.js.map