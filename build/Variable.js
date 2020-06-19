"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = void 0;
var Variable = /** @class */ (function () {
    function Variable() {
    }
    Variable.prototype.toString = function (varInJson) {
        return Object.keys(varInJson)[0];
    };
    Variable.prototype.splitCamelCase = function (varInJson, separator) {
        if (separator === void 0) { separator = ' '; }
        return this.toString(varInJson).replace(/([a-z0-9])([A-Z])/g, '$1' + separator + '$2');
    };
    return Variable;
}());
exports.variable = new Variable();
//# sourceMappingURL=Variable.js.map