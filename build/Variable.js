"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = void 0;
var String_1 = require("./String");
var Variable = /** @class */ (function () {
    function Variable() {
    }
    Variable.prototype.toString = function (varInJson) {
        if (varInJson === null) {
            return varInJson;
        }
        return Object.keys(varInJson)[0];
    };
    Variable.prototype.splitCamelCase = function (varInJson, separator) {
        if (separator === void 0) { separator = ' '; }
        return String_1.string.splitCamelCase(this.toString(varInJson), separator);
    };
    return Variable;
}());
exports.variable = new Variable();
//# sourceMappingURL=Variable.js.map