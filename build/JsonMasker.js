"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMaskingStrategy = exports.jsonMasker = void 0;
var _ = require("lodash");
var JsonRefactor_1 = require("./JsonRefactor");
var JsonComparer_1 = require("./JsonComparer");
var JsonMasker = /** @class */ (function () {
    function JsonMasker() {
    }
    JsonMasker.prototype.maskData = function (json, strategyOptions) {
        return this.maskDataHelper(json, strategyOptions);
    };
    JsonMasker.prototype.maskDataHelper = function (json, strategyOptions) {
        if (Array.isArray(json)) {
            return this.maskList(json, strategyOptions);
        }
        else {
            return this.maskJson(json, strategyOptions);
        }
    };
    JsonMasker.prototype.maskList = function (list, strategyOptions) {
        var _this = this;
        return list.map(function (element) {
            if (Array.isArray(element)) {
                return _this.maskList(element);
            }
            else if (JsonComparer_1.jsonComparer.isJSON(element)) {
                return _this.maskJson(element);
            }
            else if (isNaN(element)) {
                return _this.maskString(element);
            }
            else {
                return _this.maskNumber(element);
            }
        });
    };
    JsonMasker.prototype.maskJson = function (json, strategyOptions) {
        var _this = this;
        var jsonArray = JsonRefactor_1.jsonRefactor.toKeyValArray(json);
        return JsonRefactor_1.jsonRefactor.fromKeyValArray(jsonArray.map(function (element) {
            if (Array.isArray(element.value)) {
                return { key: element.key, value: _this.maskList(element.value) };
            }
            else if (JsonComparer_1.jsonComparer.isJSON(element.value)) {
                return { key: element.key, value: _this.maskJson(element.value) };
            }
            else if (isNaN(element.value)) {
                return { key: element.key, value: _this.maskString(element.value) };
            }
            else {
                return { key: element.key, value: _this.maskNumber(element.value) };
            }
        }));
    };
    JsonMasker.prototype.maskNumber = function (num, strategyOptions) {
        var _a, _b, _c, _d;
        var numStr = num.toString();
        var matchList = numStr.match(/(-)?(\d+)(\.)?(\d*)/);
        var sign = (_a = matchList[1]) !== null && _a !== void 0 ? _a : '';
        var wholeNumber = (_b = matchList[2]) !== null && _b !== void 0 ? _b : '0';
        var decimalPoint = (_c = matchList[3]) !== null && _c !== void 0 ? _c : '';
        var decimalValue = (_d = matchList[4]) !== null && _d !== void 0 ? _d : '';
        var newWholeNumber;
        var newDecimalValue;
        do {
            if (numStr.length === 1) {
                newWholeNumber = num * 11;
            }
            else {
                if (this.allNumbersSame(wholeNumber)) {
                    newWholeNumber = wholeNumber + '0';
                }
                else {
                    newWholeNumber = wholeNumber
                        .split('')
                        .sort(function () { return Math.random() - 0.5; })
                        .join('');
                }
            }
        } while (newWholeNumber === wholeNumber);
        if (decimalValue !== '') {
            do {
                if (this.allNumbersSame(decimalValue)) {
                    newDecimalValue = '0' + decimalValue;
                }
                else {
                    newDecimalValue = wholeNumber
                        .split('')
                        .sort(function () { return Math.random() - 0.5; })
                        .join('');
                }
            } while (decimalValue === newDecimalValue);
            return Number(sign + newWholeNumber + decimalPoint + newDecimalValue);
        }
        return Number(sign + newWholeNumber);
    };
    JsonMasker.prototype.maskString = function (str, strategyOptions) {
        var strObj = _.groupBy('three'.split('').map(function (c, i) { return ({ c: c, i: i }); }), function (j) { return j.c; });
        var newString;
        var stringArray = str.split('');
        if (str === '' || !/\S/.test(str)) {
            return Math.random().toString(36).slice(-5);
        }
        else if (str.length === 1) {
            return str + str;
        }
        else if (this.allCharsSame(str)) {
            return Math.random().toString(36).slice(-str.length);
        }
        do {
            newString = stringArray.sort(function () { return Math.random() - 0.5; }).join('');
        } while (newString === str);
        return newString;
    };
    JsonMasker.prototype.allNumbersSame = function (num) {
        var numArray = num.split('');
        for (var i = 0; i < numArray.length; i++) {
            if (numArray[i] !== numArray[i + 1]) {
                return false;
            }
        }
        return true;
    };
    JsonMasker.prototype.allCharsSame = function (str) {
        var strArray = str.split('');
        for (var i = 0; i < strArray.length; i++) {
            if (strArray[i] !== strArray[i + 1]) {
                return false;
            }
        }
        return true;
    };
    return JsonMasker;
}());
exports.jsonMasker = new JsonMasker();
var DataMaskingStrategy;
(function (DataMaskingStrategy) {
    DataMaskingStrategy[DataMaskingStrategy["Identity"] = 0] = "Identity";
    DataMaskingStrategy[DataMaskingStrategy["Scramble"] = 1] = "Scramble";
    DataMaskingStrategy[DataMaskingStrategy["Md5"] = 2] = "Md5";
    DataMaskingStrategy[DataMaskingStrategy["Nullify"] = 3] = "Nullify";
})(DataMaskingStrategy = exports.DataMaskingStrategy || (exports.DataMaskingStrategy = {}));
//# sourceMappingURL=JsonMasker.js.map