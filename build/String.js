"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = void 0;
var String = /** @class */ (function () {
    function String() {
    }
    String.prototype.splitCamelCase = function (str, separator) {
        if (separator === void 0) { separator = ' '; }
        if (str === null || str === '') {
            return str;
        }
        return str.replace(/([a-z0-9])([A-Z])/g, '$1' + separator + '$2');
    };
    String.prototype.titleCase = function (str) {
        if (str === null || str === '') {
            return str;
        }
        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
        })
            .join(' ');
    };
    return String;
}());
exports.string = new String();
//# sourceMappingURL=String.js.map