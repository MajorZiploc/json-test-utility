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
        if (m === null || undefined) {
            return false;
        }
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
    JsonComparer.prototype.sameTypes = function (thing1, thing2, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        if (Array.isArray(thing1) && Array.isArray(thing2)) {
            return this.sameTypesList(thing1, thing2, options);
        }
        if (Array.isArray(thing1) || Array.isArray(thing2)) {
            return false;
        }
        if (this.isJSON(thing1) && this.isJSON(thing2)) {
            if (this.sameKeys(thing1, thing2)) {
                // Check key paths that have no dots.
                var rootNullKeyPaths_1 = (_b = (_a = options === null || options === void 0 ? void 0 : options.nullableKeys) === null || _a === void 0 ? void 0 : _a.filter(function (k) { return k.split('.').length <= 1; })) !== null && _b !== void 0 ? _b : [];
                // Removes 1 layer of key paths.
                var nullKeys = (_c = options === null || options === void 0 ? void 0 : options.nullableKeys) === null || _c === void 0 ? void 0 : _c.map(function (k) { return k.split('.').slice(1).join('.'); }).filter(function (k) { return !_.isEqual(k, ''); });
                var opts_1 = JsonRefactor_1.jsonRefactor.setField(options, 'nullableKeys', nullKeys);
                var doesNullableRootKeysTypeCheck = rootNullKeyPaths_1.every(function (k) {
                    var v1 = thing1[k];
                    var v2 = thing2[k];
                    if (v1 === null && v2 === null) {
                        return true;
                    }
                    if (v1 === null || v2 === null) {
                        return true;
                    }
                    else {
                        return _this.sameTypes(v1, v2, opts_1);
                    }
                });
                if (doesNullableRootKeysTypeCheck === false) {
                    return false;
                }
                // Check key paths that have no dots.
                var rootDateKeyPaths_1 = (_e = (_d = options === null || options === void 0 ? void 0 : options.dateKeys) === null || _d === void 0 ? void 0 : _d.filter(function (k) { return k.split('.').length <= 1; })) !== null && _e !== void 0 ? _e : [];
                // Removes 1 layer of key paths.
                var dateKeys = (_f = options === null || options === void 0 ? void 0 : options.dateKeys) === null || _f === void 0 ? void 0 : _f.map(function (k) { return k.split('.').slice(1).join('.'); }).filter(function (k) { return !_.isEqual(k, ''); });
                var optsDate_1 = JsonRefactor_1.jsonRefactor.setField(opts_1, 'dateKeys', dateKeys);
                var doesDateRootKeysTypeCheck = rootDateKeyPaths_1.every(function (k) {
                    var v1 = thing1[k];
                    var v2 = thing2[k];
                    return new Date(v1).toString() !== 'Invalid Date' && new Date(v2).toString() !== 'Invalid Date';
                });
                if (doesDateRootKeysTypeCheck === false) {
                    return false;
                }
                var j1kva = JsonRefactor_1.jsonRefactor
                    .toKeyValArray(thing1)
                    .sort(function (kv1, kv2) { return kv1.key.localeCompare(kv2.key); })
                    .filter(function (kv) { return !rootNullKeyPaths_1.some(function (rk) { return rk === kv.key; }); })
                    .filter(function (kv) { return !rootDateKeyPaths_1.some(function (rk) { return rk === kv.key; }); });
                var j2kva = JsonRefactor_1.jsonRefactor
                    .toKeyValArray(thing2)
                    .sort(function (kv1, kv2) { return kv1.key.localeCompare(kv2.key); })
                    .filter(function (kv) { return !rootNullKeyPaths_1.some(function (rk) { return rk === kv.key; }); })
                    .filter(function (kv) { return !rootDateKeyPaths_1.some(function (rk) { return rk === kv.key; }); });
                if (j1kva.length != j2kva.length) {
                    return false;
                }
                var j1kvAndj2kv_s = _.zipWith(j1kva, j2kva, function (j1kv, j2kv) { return ({ j1kv: j1kv, j2kv: j2kv }); });
                return j1kvAndj2kv_s.every(function (j1kvAndj2kv) {
                    return _this.sameTypes(j1kvAndj2kv.j1kv.value, j1kvAndj2kv.j2kv.value, optsDate_1);
                });
            }
            return false;
        }
        if (this.isJSON(thing1) || this.isJSON(thing2)) {
            return false;
        }
        return typeof thing1 === typeof thing2;
    };
    JsonComparer.prototype.sameTypesList = function (list1, list2, options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        if ((_a = options === null || options === void 0 ? void 0 : options.subsetListCheck) !== null && _a !== void 0 ? _a : false) {
            var trimedList2 = list2.slice(0, list1.length);
            var lsz_1 = _.zipWith(list1, trimedList2, function (e1, e2) { return ({ e1: e1, e2: e2 }); });
            return lsz_1.every(function (lz) { return _this.sameTypes(lz.e1, lz.e2, options); });
        }
        // Should only check first in list
        if ((_b = options === null || options === void 0 ? void 0 : options.checkFirstInList) !== null && _b !== void 0 ? _b : false) {
            if (list1.length === 0 || list2.length === 0) {
                return (_c = options === null || options === void 0 ? void 0 : options.emptyListIsAcceptable) !== null && _c !== void 0 ? _c : false;
            }
            if (list1.length === 0 && list2.length === 0) {
                return (_d = options === null || options === void 0 ? void 0 : options.emptyListIsAcceptable) !== null && _d !== void 0 ? _d : false;
            }
            var first1 = list1[0];
            var first2 = list2[0];
            return this.sameTypes(first1, first2, options);
        }
        if ((_e = options === null || options === void 0 ? void 0 : options.emptyListIsAcceptable) !== null && _e !== void 0 ? _e : false) {
            if (list1.length === 0 || list2.length === 0) {
                return true;
            }
        }
        if (list1.length != list2.length) {
            return false;
        }
        var lsz = _.zipWith(list1, list2, function (e1, e2) { return ({ e1: e1, e2: e2 }); });
        return lsz.every(function (lz) { return _this.sameTypes(lz.e1, lz.e2, options); });
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
    JsonComparer.prototype.typecheckPrecheck = function (json, contractJson, options) {
        var _a;
        if (Array.isArray(json) && Array.isArray(contractJson)) {
            if ((_a = options === null || options === void 0 ? void 0 : options.emptyRootListAcceptable) !== null && _a !== void 0 ? _a : false) {
                return json.length === 0;
            }
        }
        return false;
    };
    JsonComparer.prototype.typecheck = function (json, contractJson, options) {
        if (this.typecheckPrecheck(json, contractJson, options)) {
            return true;
        }
        return this.typecheckRecur(json, contractJson, options);
    };
    JsonComparer.prototype.typecheckRecur = function (json, contractJson, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (Array.isArray(json) && Array.isArray(contractJson)) {
            return this.typecheckList(json, contractJson, options);
        }
        if (Array.isArray(json) || Array.isArray(contractJson)) {
            return false;
        }
        if (this.isJSON(json) && this.isJSON(contractJson)) {
            if (this.sameKeys(json, contractJson)) {
                // Check key paths that have no dots.
                var rootNullKeyPaths_2 = (_b = (_a = options === null || options === void 0 ? void 0 : options.nullableKeys) === null || _a === void 0 ? void 0 : _a.filter(function (k) { return k.split('.').length <= 1; })) !== null && _b !== void 0 ? _b : [];
                // Removes 1 layer of key paths.
                var nullKeys = (_c = options === null || options === void 0 ? void 0 : options.nullableKeys) === null || _c === void 0 ? void 0 : _c.map(function (k) { return k.split('.').slice(1).join('.'); }).filter(function (k) { return !_.isEqual(k, ''); });
                var opts_2 = JsonRefactor_1.jsonRefactor.setField(options, 'nullableKeys', nullKeys);
                var doesNullableRootKeysTypeCheck = rootNullKeyPaths_2.every(function (k) {
                    var v1 = json[k];
                    var v2 = contractJson[k];
                    if (v1 === undefined && v2 === undefined) {
                        return true;
                    }
                    if (v1 === null && v2 === null) {
                        return true;
                    }
                    if (v1 === null || v2 === null) {
                        return true;
                    }
                    else {
                        return _this.typecheckRecur(v1, v2, opts_2);
                    }
                });
                if (doesNullableRootKeysTypeCheck === false) {
                    return false;
                }
                var jNoNull_1 = JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(json).filter(function (kv) { return !rootNullKeyPaths_2.some(function (rk) { return rk === kv.key; }); }));
                var cjNoNull_1 = JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(contractJson).filter(function (kv) { return !rootNullKeyPaths_2.some(function (rk) { return rk === kv.key; }); }));
                // Check key paths that have no dots.
                var rootDateKeyPaths_2 = (_e = (_d = options === null || options === void 0 ? void 0 : options.dateKeys) === null || _d === void 0 ? void 0 : _d.filter(function (k) { return k.split('.').length <= 1; })) !== null && _e !== void 0 ? _e : [];
                // Removes 1 layer of key paths.
                var dateKeys = (_f = options === null || options === void 0 ? void 0 : options.dateKeys) === null || _f === void 0 ? void 0 : _f.map(function (k) { return k.split('.').slice(1).join('.'); }).filter(function (k) { return !_.isEqual(k, ''); });
                var optsDate = JsonRefactor_1.jsonRefactor.setField(opts_2, 'dateKeys', dateKeys);
                var doesDateRootKeysTypeCheck = rootDateKeyPaths_2.every(function (k) {
                    var v1 = jNoNull_1[k];
                    var v2 = cjNoNull_1[k];
                    if (v1 === undefined && v2 === undefined) {
                        return true;
                    }
                    return new Date(v1).toString() !== 'Invalid Date' && new Date(v2).toString() !== 'Invalid Date';
                });
                if (doesDateRootKeysTypeCheck === false) {
                    return false;
                }
                var jNoDate_1 = JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(jNoNull_1).filter(function (kv) { return !rootDateKeyPaths_2.some(function (rk) { return rk === kv.key; }); }));
                var cjNoDate_1 = JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(cjNoNull_1).filter(function (kv) { return !rootDateKeyPaths_2.some(function (rk) { return rk === kv.key; }); }));
                // Check key paths that have no dots.
                var rootMTListKeyPaths_1 = (_h = (_g = options === null || options === void 0 ? void 0 : options.emptyListKeys) === null || _g === void 0 ? void 0 : _g.filter(function (k) { return k.split('.').length <= 1; })) !== null && _h !== void 0 ? _h : [];
                // Removes 1 layer of key paths.
                var mtListKeys = (_j = options === null || options === void 0 ? void 0 : options.emptyListKeys) === null || _j === void 0 ? void 0 : _j.map(function (k) { return k.split('.').slice(1).join('.'); }).filter(function (k) { return !_.isEqual(k, ''); });
                var optsMTList_1 = JsonRefactor_1.jsonRefactor.setField(optsDate, 'emptyListKeys', mtListKeys);
                var doesMTListRootKeysTypeCheck = rootMTListKeyPaths_1.every(function (k) {
                    var v1 = jNoDate_1[k];
                    var v2 = cjNoDate_1[k];
                    if (v1 === undefined && v2 === undefined) {
                        return true;
                    }
                    if (v1.length === 0) {
                        return true;
                    }
                    return _this.typecheckList(v1, v2, optsMTList_1);
                });
                if (doesMTListRootKeysTypeCheck === false) {
                    return false;
                }
                var jNoMTList = JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(jNoDate_1).filter(function (kv) { return !rootMTListKeyPaths_1.some(function (rk) { return rk === kv.key; }); }));
                var cjNoMTList = JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(cjNoDate_1).filter(function (kv) { return !rootMTListKeyPaths_1.some(function (rk) { return rk === kv.key; }); }));
                var j1kva = JsonRefactor_1.jsonRefactor.toKeyValArray(jNoMTList).sort(function (kv1, kv2) { return kv1.key.localeCompare(kv2.key); });
                var j2kva = JsonRefactor_1.jsonRefactor.toKeyValArray(cjNoMTList).sort(function (kv1, kv2) { return kv1.key.localeCompare(kv2.key); });
                if (j1kva.length != j2kva.length) {
                    return false;
                }
                var j1kvAndj2kv_s = _.zipWith(j1kva, j2kva, function (j1kv, j2kv) { return ({ j1kv: j1kv, j2kv: j2kv }); });
                return j1kvAndj2kv_s.every(function (j1kvAndj2kv) {
                    return _this.typecheckRecur(j1kvAndj2kv.j1kv.value, j1kvAndj2kv.j2kv.value, optsMTList_1);
                });
            }
            return false;
        }
        if (this.isJSON(json) || this.isJSON(contractJson)) {
            return false;
        }
        return typeof json === typeof contractJson;
    };
    JsonComparer.prototype.typecheckList = function (list, contractList, options) {
        var _this = this;
        if (contractList.length === 0) {
            throw new Error('All lists in the contract need to have 1 element for comparison.');
        }
        return list.every(function (e) { return _this.typecheckRecur(e, contractList[0], options); });
    };
    return JsonComparer;
}());
exports.jsonComparer = new JsonComparer();
//# sourceMappingURL=JsonComparer.js.map