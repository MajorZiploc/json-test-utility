"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonMasker = exports.DataMaskingStrategy = void 0;
var _ = require("lodash");
var JsonRefactor_1 = require("./JsonRefactor");
var JsonComparer_1 = require("./JsonComparer");
var DataMaskingStrategy;
(function (DataMaskingStrategy) {
    DataMaskingStrategy[DataMaskingStrategy["Identity"] = 0] = "Identity";
    DataMaskingStrategy[DataMaskingStrategy["Scramble"] = 1] = "Scramble";
    // Md5,
    DataMaskingStrategy[DataMaskingStrategy["Nullify"] = 2] = "Nullify";
    // Deep,
})(DataMaskingStrategy = exports.DataMaskingStrategy || (exports.DataMaskingStrategy = {}));
var identity = DataMaskingStrategy[DataMaskingStrategy.Identity];
var scramble = DataMaskingStrategy[DataMaskingStrategy.Scramble];
// const md5 = DataMaskingStrategy[DataMaskingStrategy.Md5];
var nullify = DataMaskingStrategy[DataMaskingStrategy.Nullify];
var JsonMasker = /** @class */ (function () {
    function JsonMasker() {
        var DataMaskingStrategyList = [
            DataMaskingStrategy.Identity,
            DataMaskingStrategy.Scramble,
            // DataMaskingStrategy.Md5,
            DataMaskingStrategy.Nullify,
        ];
        this.DataMaskingStrategyList = DataMaskingStrategyList;
        var DataMaskingStrategyNameList = [];
        for (var enumMember in DataMaskingStrategy) {
            var isValueProperty = parseInt(enumMember, 10) >= 0;
            if (isValueProperty) {
                DataMaskingStrategyNameList.push(DataMaskingStrategy[enumMember]);
            }
        }
        this.DataMaskingStrategyNameList = DataMaskingStrategyNameList;
        this.numStrats = JsonRefactor_1.jsonRefactor.fromKeyValArray(this.DataMaskingStrategyNameList.map(function (n) { return ({ key: n, value: null }); }));
        this.numStrats[identity] = function (num) { return num; };
        this.numStrats[scramble] = this.maskNum.bind(this);
        this.numStrats[nullify] = function (num) { return 0; };
        this.strStrats = JsonRefactor_1.jsonRefactor.fromKeyValArray(this.DataMaskingStrategyNameList.map(function (n) { return ({ key: n, value: null }); }));
        this.strStrats[identity] = function (str) { return str; };
        this.strStrats[scramble] = this.maskStrScramble.bind(this);
        this.strStrats[nullify] = function (str) { return ''; };
        this.boolStrats = JsonRefactor_1.jsonRefactor.fromKeyValArray(this.DataMaskingStrategyNameList.map(function (n) { return ({ key: n, value: null }); }));
        this.boolStrats[identity] = function (bool) { return bool; };
        this.boolStrats[scramble] = this.maskBoolScramble.bind(this);
        this.boolStrats[nullify] = function (bool) { return false; };
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
    JsonMasker.prototype.isDataMaskingStrategy = function (option) {
        return this.DataMaskingStrategyList.some(function (s) { return s === option; });
    };
    JsonMasker.prototype.isFunction = function (option) {
        return option && {}.toString.call(option) === '[object Function]';
    };
    JsonMasker.prototype.ensureStrategyOptions = function (strategyOptions) {
        var sOptions = strategyOptions !== null && strategyOptions !== void 0 ? strategyOptions : { overall: this.defaultMaskingStrategy() };
        return sOptions;
        // const labels = ['overall', 'json', 'string', 'number', 'html', 'date', 'boolean', 'list];
        // const strats = _.range(labels.length).map(i => this.defaultMaskingStrategy());
        // const labelAndStrat_s = _.zipWith(labels, strats, (label, strat) => ({ label, strat }));
        // return labelAndStrat_s.reduce((acc, labelAndStrat) => {
        //   const s = acc[labelAndStrat.label] ?? labelAndStrat.strat;
        //   return jr.setField(acc, labelAndStrat.label, s);
        // }, sOptions);
    };
    JsonMasker.prototype.defaultMaskingStrategy = function () {
        return DataMaskingStrategy.Scramble;
    };
    JsonMasker.prototype.chooseStrategy = function (strategies) {
        var _a;
        return (_a = strategies.find(function (s) { return s != null; })) !== null && _a !== void 0 ? _a : this.defaultMaskingStrategy();
    };
    JsonMasker.prototype.maskList = function (list, strategyOptions) {
        var _this = this;
        var stratOrFn = this.chooseStrategy([strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.list, strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.overall]);
        var l = list;
        if (this.isFunction(stratOrFn)) {
            var fn = stratOrFn;
            l = fn(list);
        }
        var strategy = stratOrFn;
        if (strategy === DataMaskingStrategy.Identity) {
            // Do nothing
        }
        if (strategy === DataMaskingStrategy.Nullify) {
            return [];
        }
        if (strategy === DataMaskingStrategy.Scramble) {
            l = _.shuffle(l);
        }
        // if (strategy === DataMaskingStrategy.Md5) {
        //   throw new Error('Md5 masking path not implemented for list');
        // }
        return l.map(function (element) {
            if (Array.isArray(element)) {
                return _this.maskList(element, strategyOptions);
            }
            else if (JsonComparer_1.jsonComparer.isJSON(element)) {
                return _this.maskJson(element, strategyOptions);
            }
            else if (_.isEqual(typeof element, 'string')) {
                return _this.maskString(element, strategyOptions);
            }
            else if (_.isEqual(typeof element, 'boolean')) {
                return _this.maskBool(element, strategyOptions);
            }
            else {
                return _this.maskNumber(element, strategyOptions);
            }
        });
    };
    JsonMasker.prototype.maskJson = function (json, strategyOptions) {
        var _this = this;
        var stratOrFn = this.chooseStrategy([strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.json, strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.overall]);
        if (this.isFunction(stratOrFn)) {
            var fn = stratOrFn;
            return fn(json);
        }
        var strategy = stratOrFn;
        if (strategy === DataMaskingStrategy.Identity) {
            return json;
        }
        if (strategy === DataMaskingStrategy.Nullify) {
            // TODO: Should the value be passed through a nullify process for each data type?
            return JsonRefactor_1.jsonRefactor.fromKeyValArray(JsonRefactor_1.jsonRefactor.toKeyValArray(json).map(function (kv) { return ({ key: kv.key, value: null }); }));
        }
        // if (strategy === DataMaskingStrategy.Scramble) {
        //   throw new Error('Scramble masking path not implemented for json');
        // }
        // if (strategy === DataMaskingStrategy.Md5) {
        //   throw new Error('Md5 masking path not implemented for json');
        // }
        var jsonArray = JsonRefactor_1.jsonRefactor.toKeyValArray(json);
        return JsonRefactor_1.jsonRefactor.fromKeyValArray(jsonArray.map(function (element) {
            if (Array.isArray(element.value)) {
                return { key: element.key, value: _this.maskList(element.value, strategyOptions) };
            }
            else if (JsonComparer_1.jsonComparer.isJSON(element.value)) {
                return { key: element.key, value: _this.maskJson(element.value, strategyOptions) };
            }
            else if (_.isEqual(typeof element.value, 'string')) {
                return { key: element.key, value: _this.maskString(element.value, strategyOptions) };
            }
            else if (_.isEqual(typeof element.value, 'boolean')) {
                return { key: element.key, value: _this.maskBool(element.value, strategyOptions) };
            }
            else {
                return { key: element.key, value: _this.maskNumber(element.value, strategyOptions) };
            }
        }));
    };
    JsonMasker.prototype.maskThing = function (thing, priorityOfStrategies, strategies, dataType) {
        var stratOrFn = this.chooseStrategy(priorityOfStrategies);
        if (this.isFunction(stratOrFn)) {
            var fn = stratOrFn;
            return fn(thing);
        }
        var strategy = stratOrFn;
        var stratFn = strategies[DataMaskingStrategy[strategy]];
        if (stratFn != null) {
            return stratFn(thing);
        }
        else {
            this.StrategyNotSupported(strategy, dataType, strategies);
        }
    };
    JsonMasker.prototype.maskNumber = function (num, strategyOptions) {
        return this.maskThing(num, [strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.number, strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.overall], this.numStrats, 'number');
    };
    JsonMasker.prototype.StrategyNotSupported = function (strategy, dataType, strategies) {
        throw new Error(dataType +
            ' does not support the ' +
            DataMaskingStrategy[strategy] +
            ' strategy.\nThe following strategies are supported: [' +
            JsonRefactor_1.jsonRefactor
                .toKeyValArray(strategies)
                .filter(function (kv) { return kv.value != null; })
                .map(function (kv) { return kv.key; })
                .join(', ') +
            ']');
    };
    JsonMasker.prototype.maskNum = function (num) {
        return this.maskNumScrambler(num);
    };
    JsonMasker.prototype.maskString = function (str, strategyOptions) {
        return this.maskThing(str, [strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.string, strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.overall], this.strStrats, 'string');
    };
    JsonMasker.prototype.maskBool = function (bool, strategyOptions) {
        return this.maskThing(bool, [strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.boolean, strategyOptions === null || strategyOptions === void 0 ? void 0 : strategyOptions.overall], this.boolStrats, 'boolean');
    };
    JsonMasker.prototype.maskBoolScramble = function (bool) {
        var max = 100;
        var min = 0;
        var num = Math.floor(Math.random() * (max - min) + min);
        return num % 2 === 0;
    };
    JsonMasker.prototype.shuffle = function (item) {
        return item.sort(function () { return Math.random() - 0.5; });
    };
    JsonMasker.prototype.maskStrScramble = function (str, min, max) {
        if (min === void 0) { min = 33; }
        if (max === void 0) { max = 126; }
        var strKeyValArray = JsonRefactor_1.jsonRefactor
            .toKeyValArray(_.groupBy(str.split('').map(function (c, i) { return ({ c: c, i: i }); }), function (j) { return j.c; }))
            .map(function (kv) { return ({ key: kv.key, value: kv.value.map(function (j) { return j.i; }) }); })
            .map(function (kv) { return [kv.key, kv.value]; });
        var _a = _.unzip(strKeyValArray), keys = _a[0], values = _a[1];
        var v = values;
        if (keys.length === 1) {
            var charCode = keys[0].charCodeAt(0);
            keys[0] = String.fromCharCode(this.getRandomNumber(min, max, [charCode]));
        }
        else if (keys.length <= 3) {
            var newValArr_1 = [];
            v.forEach(function (ve) {
                if (v.indexOf(ve) === v.length - 1) {
                    newValArr_1[0] = ve;
                }
                else {
                    newValArr_1[v.indexOf(ve) + 1] = ve;
                }
            });
            v = newValArr_1;
        }
        else {
            do {
                v = _.sortBy(v, function () { return Math.random() - 0.5; });
            } while (_.isEqual(values, v));
        }
        var newKVWord = _.zipWith(keys, v, function (key, value) { return ({ key: key, value: value }); });
        return newKVWord
            .reduce(function (chars, kv) {
            kv.value.forEach(function (index) {
                chars[index] = kv.key;
            });
            return chars;
        }, [])
            .join('');
    };
    JsonMasker.prototype.getRandomNumber = function (min, max, valuesToExclude) {
        if (valuesToExclude === void 0) { valuesToExclude = []; }
        var rand = null; //an integer
        var valuesToExcludeSet = new Set(valuesToExclude);
        var maximum = max + 1; // Doing this makes max inclusive
        while (rand === null || valuesToExcludeSet.has(rand)) {
            rand = Math.floor(Math.random() * (max - min) + min);
        }
        return rand;
    };
    JsonMasker.prototype.maskNumScrambler = function (num) {
        var _a, _b, _c, _d;
        var numStr = num.toString();
        var matchList = numStr.match(/(-)?(\d+)(\.)?(\d*)/);
        var sign = (_a = matchList[1]) !== null && _a !== void 0 ? _a : '';
        var wholeNumber = (_b = matchList[2]) !== null && _b !== void 0 ? _b : '0';
        var decimalPoint = (_c = matchList[3]) !== null && _c !== void 0 ? _c : '';
        var decimalValue = (_d = matchList[4]) !== null && _d !== void 0 ? _d : '';
        var wNum = this.maskStrScramble(wholeNumber, 48, 57); // limits range to numbers
        var decVal = '';
        if (decimalValue) {
            decVal = this.maskStrScramble(decimalValue, 48, 57);
        }
        return JSON.parse(sign + wNum + decimalPoint + decVal);
    };
    return JsonMasker;
}());
exports.jsonMasker = new JsonMasker();
//# sourceMappingURL=JsonMasker.js.map