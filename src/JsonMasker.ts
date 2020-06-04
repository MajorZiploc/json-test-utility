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
  list?: DataMaskingStrategy | ((originalList: any) => any);
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
    this.numStrats[scramble] = this.maskNumScramble.bind(this);
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
    if (this.isFunction(stratOrFn)) {
      const fn = stratOrFn as any;
      return fn(list);
    }
    const strategy = stratOrFn as any;
    let l = list;
    if (strategy === DataMaskingStrategy.Identity) {
      l = list;
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

  private maskNumScramble(num: number) {
    const numStr = num.toString();
    const matchList = numStr.match(/(-)?(\d+)(\.)?(\d*)/);
    const sign = matchList[1] ?? '';
    const wholeNumber = matchList[2] ?? '0';
    const decimalPoint = matchList[3] ?? '';
    const decimalValue = matchList[4] ?? '';
    let newWholeNumber;
    let newDecimalValue;
    do {
      if (numStr.length === 1) {
        newWholeNumber = num * 11;
      } else {
        if (this.allNumbersSame(wholeNumber)) {
          newWholeNumber = wholeNumber + '0';
        } else {
          newWholeNumber = wholeNumber
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
        }
      }
    } while (newWholeNumber === wholeNumber);
    if (decimalValue !== '') {
      do {
        if (this.allNumbersSame(decimalValue)) {
          newDecimalValue = '0' + decimalValue;
        } else {
          newDecimalValue = this.shuffle(wholeNumber.split('')).join('');
        }
      } while (decimalValue === newDecimalValue);
      return Number(sign + newWholeNumber + decimalPoint + newDecimalValue);
    }
    return Number(sign + newWholeNumber);
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

  private maskStrScramble(str: string) {
    let strObj = _.groupBy(
      'three'.split('').map((c, i) => ({ c, i })),
      j => j.c
    );
    let newString;
    let stringArray = str.split('');
    if (str === '' || !/\S/.test(str)) {
      return Math.random().toString(36).slice(-5);
    } else if (str.length === 1) {
      return str + str;
    } else if (this.allCharsSame(str)) {
      return Math.random().toString(36).slice(-str.length);
    }
    do {
      newString = this.shuffle(stringArray).join('');
    } while (newString === str);
    return newString;
  }

  private shuffle(thing: any[]): any[] {
    return thing.sort(() => Math.random() - 0.5);
  }

  private allNumbersSame(num: string) {
    let numArray = num.split('');
    for (let i = 0; i < numArray.length; i++) {
      if (numArray[i] !== numArray[i + 1]) {
        return false;
      }
    }
    return true;
  }

  private allCharsSame(str: string) {
    let strArray = str.split('');
    for (let i = 0; i < strArray.length; i++) {
      if (strArray[i] !== strArray[i + 1]) {
        return false;
      }
    }
    return true;
  }
}

export const jsonMasker = new JsonMasker();
