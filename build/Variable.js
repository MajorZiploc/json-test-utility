"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = void 0;
var Variable = /** @class */ (function () {
    function Variable() {
    }
    Variable.prototype.toString = function (varInJson) {
        return Object.keys(varInJson)[0];
    };
    return Variable;
}());
exports.variable = new Variable();
//# sourceMappingURL=Variable.js.map