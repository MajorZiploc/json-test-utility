"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonMasker = void 0;
var JsonMasker = /** @class */ (function () {
    function JsonMasker() {
    }
    JsonMasker.prototype.maskData = function (json) {
        return this.maskDataHelper(json);
    };
    JsonMasker.prototype.maskDataHelper = function (json) {
        // check if its a list
        // call maskList(json)
        // check if its a json
        // jc.isJSON
        // call maskJson(json)
    };
    JsonMasker.prototype.maskList = function (list) {
        return [];
    };
    JsonMasker.prototype.maskJson = function (json) {
        // jr.toKeyValArray;
        // jr.fromKeyValArray;
    };
    JsonMasker.prototype.maskNumber = function (num) {
        return 0;
    };
    JsonMasker.prototype.maskString = function (str) {
        return '';
    };
    return JsonMasker;
}());
exports.jsonMasker = new JsonMasker();
//# sourceMappingURL=JsonMasker.js.map