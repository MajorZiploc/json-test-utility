"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonMasker = void 0;
var JsonRefactor_1 = require("./JsonRefactor");
var JsonComparer_1 = require("./JsonComparer");
var JsonMasker = /** @class */ (function () {
    function JsonMasker() {
    }
    JsonMasker.prototype.maskData = function (json) {
        return this.maskDataHelper(json);
    };
    JsonMasker.prototype.maskDataHelper = function (json) {
        if (Array.isArray(json)) {
            return this.maskList(json);
        }
        else {
            return this.maskJson(json);
        }
    };
    JsonMasker.prototype.maskList = function (list) {
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
    JsonMasker.prototype.maskJson = function (json) {
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
    JsonMasker.prototype.maskNumber = function (num) {
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
                newWholeNumber = wholeNumber.split('').sort(function () { return Math.random() - 0.5; }).join('');
            }
        } while (newWholeNumber === wholeNumber);
        if (decimalValue !== "") {
            do {
                newDecimalValue = wholeNumber.split('').sort(function () { return Math.random() - 0.5; }).join('');
            } while (decimalValue === newDecimalValue);
            return Number(sign + newWholeNumber + decimalPoint + newDecimalValue);
        }
        return Number(sign + newWholeNumber);
    };
    JsonMasker.prototype.maskString = function (str) {
        var newString;
        var stringArray = str.split('');
        if (str === "") {
            return Math.random().toString(36).slice(-5);
        }
        do {
            newString = stringArray.sort(function () { return Math.random() - 0.5; }).join('');
        } while (newString === str);
        return newString;
    };
    return JsonMasker;
}());
exports.jsonMasker = new JsonMasker();
//# sourceMappingURL=JsonMasker.js.map