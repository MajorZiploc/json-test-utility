"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
var List = /** @class */ (function () {
    function List() {
    }
    /**
     * Sorts by ascending order be default using <= operator
     *
     * @param arr
     * @param comparer
     */
    List.prototype.isSorted = function (arr, comparer) {
        if (comparer === void 0) { comparer = function (f, s) { return f <= s; }; }
        return arr.every(function (v, i, a) { return !i || comparer(a[i - 1], v); });
    };
    List.prototype.isSortedAsc = function (arr) {
        return this.isSorted(arr);
    };
    List.prototype.isSortedDesc = function (arr) {
        return this.isSorted(arr, function (f, s) { return f >= s; });
    };
    return List;
}());
exports.list = new List();
//# sourceMappingURL=List.js.map