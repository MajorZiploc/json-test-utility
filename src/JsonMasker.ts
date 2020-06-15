import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';
import { jsonComparer as jc } from './JsonComparer';

export enum DataMaskingStrategy {
  Identity,
  Scramble,
  // Md5,
  Nullify,
  // Deep,
}

export interface StrategyOptions {
  overall?: DataMaskingStrategy;
  json?: DataMaskingStrategy | ((originalJson: any) => any);
  string?: DataMaskingStrategy | ((originalString: string) => string);
  number?: DataMaskingStrategy | ((originalNumber: number) => number);
  boolean?: DataMaskingStrategy | ((originalBoolean: boolean) => boolean);
  date?: DataMaskingStrategy | ((originalDate: string) => string);
  html?: DataMaskingStrategy | ((originalHtml: string) => string);
  list?: DataMaskingStrategy | ((originalList: any[]) => any[]);
}

const identity = DataMaskingStrategy[DataMaskingStrategy.Identity];
const scramble = DataMaskingStrategy[DataMaskingStrategy.Scramble];
// const md5 = DataMaskingStrategy[DataMaskingStrategy.Md5];
const nullify = DataMaskingStrategy[DataMaskingStrategy.Nullify];

interface Strategies {
  Identity: ((thing: any) => any) | null;
  Scramble: ((thing: any) => any) | null;
  // Md5: ((thing: any) => any) | null;
  Nullify: ((thing: any) => any) | null;
}

class JsonMasker {
  private DataMaskingStrategyList: DataMaskingStrategy[];
  private DataMaskingStrategyNameList: string[];
  private numStrats: Strategies;
  private strStrats: Strategies;
  private boolStrats: Strategies;
  constructor() {
    const DataMaskingStrategyList = [
      DataMaskingStrategy.Identity,
      DataMaskingStrategy.Scramble,
      // DataMaskingStrategy.Md5,
      DataMaskingStrategy.Nullify,
      // DataMaskingStrategy.Deep // will be used to mask things inside lists and jsons even if json and list have a masking strategy of their own
    ];
    this.DataMaskingStrategyList = DataMaskingStrategyList;
    const DataMaskingStrategyNameList = [];
    for (var enumMember in DataMaskingStrategy) {
      var isValueProperty = parseInt(enumMember, 10) >= 0;
      if (isValueProperty) {
        DataMaskingStrategyNameList.push(DataMaskingStrategy[enumMember]);
      }
    }
    this.DataMaskingStrategyNameList = DataMaskingStrategyNameList;

    this.numStrats = jr.fromKeyValArray(this.DataMaskingStrategyNameList.map(n => ({ key: n, value: null })));
    this.numStrats[identity] = num => num;
    this.numStrats[scramble] = this.maskNum.bind(this);
    this.numStrats[nullify] = num => 0;

    this.strStrats = jr.fromKeyValArray(this.DataMaskingStrategyNameList.map(n => ({ key: n, value: null })));
    this.strStrats[identity] = str => str;
    this.strStrats[scramble] = this.maskStrScramble.bind(this);
    this.strStrats[nullify] = str => '';

    this.boolStrats = jr.fromKeyValArray(this.DataMaskingStrategyNameList.map(n => ({ key: n, value: null })));
    this.boolStrats[identity] = bool => bool;
    this.boolStrats[scramble] = this.maskBoolScramble.bind(this);
    this.boolStrats[nullify] = bool => false;
  }
  public maskData(json: any, strategyOptions?: StrategyOptions) {
    return this.maskDataHelper(json, strategyOptions);
  }

  private maskDataHelper(json: any, strategyOptions?: StrategyOptions) {
    if (Array.isArray(json)) {
      return this.maskList(json, strategyOptions);
    } else {
      return this.maskJson(json, strategyOptions);
    }
  }

  private isDataMaskingStrategy(option: DataMaskingStrategy | ((originalThing: any) => any)) {
    return this.DataMaskingStrategyList.some(s => s === option);
  }

  private isFunction(option: DataMaskingStrategy | ((originalThing: any) => any)) {
    return option && {}.toString.call(option) === '[object Function]';
  }

  private ensureStrategyOptions(strategyOptions?: StrategyOptions): StrategyOptions {
    const sOptions = strategyOptions ?? { overall: this.defaultMaskingStrategy() };
    return sOptions;
    // const labels = ['overall', 'json', 'string', 'number', 'html', 'date', 'boolean', 'list];
    // const strats = _.range(labels.length).map(i => this.defaultMaskingStrategy());
    // const labelAndStrat_s = _.zipWith(labels, strats, (label, strat) => ({ label, strat }));
    // return labelAndStrat_s.reduce((acc, labelAndStrat) => {
    //   const s = acc[labelAndStrat.label] ?? labelAndStrat.strat;
    //   return jr.setField(acc, labelAndStrat.label, s);
    // }, sOptions);
  }

  private defaultMaskingStrategy(): DataMaskingStrategy {
    return DataMaskingStrategy.Scramble;
  }

  private chooseStrategy(
    strategies: (DataMaskingStrategy | ((original: any) => any) | null)[]
  ): DataMaskingStrategy | ((original: any) => any) {
    return strategies.find(s => s != null) ?? this.defaultMaskingStrategy();
  }

  private maskList(list: any[], strategyOptions?: StrategyOptions): any[] {
    const stratOrFn = this.chooseStrategy([strategyOptions?.list, strategyOptions?.overall]);
    let l = list;
    if (this.isFunction(stratOrFn)) {
      const fn = stratOrFn as any;
      l = fn(list);
    }
    const strategy = stratOrFn as any;
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
    return l.map(element => {
      if (Array.isArray(element)) {
        return this.maskList(element, strategyOptions);
      } else if (jc.isJSON(element)) {
        return this.maskJson(element, strategyOptions);
      } else if (_.isEqual(typeof element, 'string')) {
        return this.maskString(element, strategyOptions);
      } else if (_.isEqual(typeof element, 'boolean')) {
        return this.maskBool(element, strategyOptions);
      } else {
        return this.maskNumber(element, strategyOptions);
      }
    });
  }

  private maskJson(json: any, strategyOptions?: StrategyOptions): any {
    const stratOrFn = this.chooseStrategy([strategyOptions?.json, strategyOptions?.overall]);
    if (this.isFunction(stratOrFn)) {
      const fn = stratOrFn as any;
      return fn(json);
    }
    const strategy = stratOrFn as any;
    if (strategy === DataMaskingStrategy.Identity) {
      return json;
    }
    if (strategy === DataMaskingStrategy.Nullify) {
      // TODO: Should the value be passed through a nullify process for each data type?
      return jr.fromKeyValArray(jr.toKeyValArray(json).map(kv => ({ key: kv.key, value: null })));
    }
    // if (strategy === DataMaskingStrategy.Scramble) {
    //   throw new Error('Scramble masking path not implemented for json');
    // }
    // if (strategy === DataMaskingStrategy.Md5) {
    //   throw new Error('Md5 masking path not implemented for json');
    // }
    const jsonArray = jr.toKeyValArray(json);
    return jr.fromKeyValArray(
      jsonArray.map(element => {
        if (Array.isArray(element.value)) {
          return { key: element.key, value: this.maskList(element.value, strategyOptions) };
        } else if (jc.isJSON(element.value)) {
          return { key: element.key, value: this.maskJson(element.value, strategyOptions) };
        } else if (_.isEqual(typeof element.value, 'string')) {
          return { key: element.key, value: this.maskString(element.value, strategyOptions) };
        } else if (_.isEqual(typeof element.value, 'boolean')) {
          return { key: element.key, value: this.maskBool(element.value, strategyOptions) };
        } else {
          return { key: element.key, value: this.maskNumber(element.value, strategyOptions) };
        }
      })
    );
  }

  private maskThing<T>(
    thing: T,
    priorityOfStrategies: (DataMaskingStrategy | ((original: any) => any) | null)[],
    strategies: Strategies,
    dataType: string
  ): T {
    const stratOrFn = this.chooseStrategy(priorityOfStrategies);
    if (this.isFunction(stratOrFn)) {
      const fn = stratOrFn as any;
      return fn(thing);
    }
    const strategy = stratOrFn as any;
    const stratFn = strategies[DataMaskingStrategy[strategy]];
    if (stratFn != null) {
      return stratFn(thing);
    } else {
      this.StrategyNotSupported(strategy, dataType, strategies);
    }
  }

  private maskNumber(num: number, strategyOptions?: StrategyOptions) {
    return this.maskThing(num, [strategyOptions?.number, strategyOptions?.overall], this.numStrats, 'number');
  }
  private StrategyNotSupported(strategy: DataMaskingStrategy, dataType: string, strategies: Strategies) {
    throw new Error(
      dataType +
        ' does not support the ' +
        DataMaskingStrategy[strategy] +
        ' strategy.\nThe following strategies are supported: [' +
        jr
          .toKeyValArray(strategies)
          .filter(kv => kv.value != null)
          .map(kv => kv.key)
          .join(', ') +
        ']'
    );
  }

  private maskNum(num: number) {
    return this.maskNumScrambler(num);
  }

  private maskString(str: string, strategyOptions?: StrategyOptions): string {
    return this.maskThing(str, [strategyOptions?.string, strategyOptions?.overall], this.strStrats, 'string');
  }

  private maskBool(bool: boolean, strategyOptions?: StrategyOptions): boolean {
    return this.maskThing(bool, [strategyOptions?.boolean, strategyOptions?.overall], this.boolStrats, 'boolean');
  }

  private maskBoolScramble(bool: boolean) {
    const max = 100;
    const min = 0;
    const num = Math.floor(Math.random() * (max - min) + min);
    return num % 2 === 0;
  }

  private shuffle(item: any[]) {
    return item.sort(() => Math.random() - 0.5);
  }

  private maskStrScramble(str: string, min: number = 33, max: number = 126) {
    let strKeyValArray = jr
      .toKeyValArray(
        _.groupBy(
          str.split('').map((c, i) => ({ c, i })),
          j => j.c
        )
      )
      .map(kv => ({ key: kv.key, value: kv.value.map(j => j.i) }))
      .map(kv => [kv.key, kv.value]);
    const [keys, values] = _.unzip(strKeyValArray);
    let v = values;

    if (keys.length === 1) {
      const charCode = keys[0].charCodeAt(0);
      keys[0] = String.fromCharCode(this.getRandomNumber(min, max, [charCode]));
    } else if (keys.length <= 3) {
      let newValArr = [];
      v.forEach(ve => {
        if (v.indexOf(ve) === v.length - 1) {
          newValArr[0] = ve;
        } else {
          newValArr[v.indexOf(ve) + 1] = ve;
        }
      });
      v = newValArr;
    } else {
      do {
        v = _.sortBy(v, () => Math.random() - 0.5);
      } while (_.isEqual(values, v));
    }

    const newKVWord = _.zipWith(keys, v, (key, value) => ({ key, value }));
    return newKVWord
      .reduce((chars, kv) => {
        kv.value.forEach(index => {
          chars[index] = kv.key;
        });
        return chars;
      }, [])
      .join('');
  }

  getRandomNumber(min: number, max: number, valuesToExclude: number[] = []) {
    var rand = null; //an integer
    const valuesToExcludeSet = new Set(valuesToExclude);
    const maximum = max + 1; // Doing this makes max inclusive
    while (rand === null || valuesToExcludeSet.has(rand)) {
      rand = Math.floor(Math.random() * (max - min) + min);
    }
    return rand;
  }

  private maskNumScrambler(num: number) {
    const numStr = num.toString();
    const matchList = numStr.match(/(-)?(\d+)(\.)?(\d*)/);
    const sign = matchList[1] ?? '';
    const wholeNumber = matchList[2] ?? '0';
    const decimalPoint = matchList[3] ?? '';
    const decimalValue = matchList[4] ?? '';

    const wNum = this.maskStrScramble(wholeNumber, 48, 57); // limits range to numbers
    let decVal = '';
    if (decimalValue) {
      decVal = this.maskStrScramble(decimalValue, 48, 57);
    }
    return JSON.parse(sign + wNum + decimalPoint + decVal);
  }
}

export const jsonMasker = new JsonMasker();
