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
    return DataMaskingStrategyList.some(s => s === option);
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
    if (strategy === DataMaskingStrategy.Identity) {
      return list;
    }
    if (strategy === DataMaskingStrategy.Nullify) {
      return [];
    }
    // if (strategy === DataMaskingStrategy.Scramble) {
    //   throw new Error('Scramble masking path not implemented for json');
    // }
    // if (strategy === DataMaskingStrategy.Md5) {
    //   throw new Error('Md5 masking path not implemented for json');
    // }
    return list.map(element => {
      if (Array.isArray(element)) {
        return this.maskList(element, strategyOptions);
      } else if (jc.isJSON(element)) {
        return this.maskJson(element, strategyOptions);
      } else if (isNaN(element)) {
        return this.maskString(element, strategyOptions);
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
        } else if (isNaN(element.value)) {
          return { key: element.key, value: this.maskString(element.value, strategyOptions) };
        } else {
          return { key: element.key, value: this.maskNumber(element.value, strategyOptions) };
        }
      })
    );
  }

  private maskNumber(num: number, strategyOptions?: StrategyOptions) {
    const stratOrFn = this.chooseStrategy([strategyOptions?.number, strategyOptions?.overall]);
    if (this.isFunction(stratOrFn)) {
      const fn = stratOrFn as any;
      return fn(num);
    }
    const strategy = stratOrFn as any;
    if (strategy === DataMaskingStrategy.Identity) {
      return num;
    }
    if (strategy === DataMaskingStrategy.Nullify) {
      return 0;
    }
    if (strategy === DataMaskingStrategy.Scramble) {
      return this.maskNumScramble(num);
    }
    if (strategy === DataMaskingStrategy.Md5) {
      throw new Error('Md5 num path not implemented');
    }
    throw new Error(
      'No valid strategy found for numbers.\nStrategies given: ' + strategyOptions + '\nnum to mask: ' + num
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
          newDecimalValue = wholeNumber
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
        }
      } while (decimalValue === newDecimalValue);
      return Number(sign + newWholeNumber + decimalPoint + newDecimalValue);
    }
    return Number(sign + newWholeNumber);
  }

  private maskString(str: string, strategyOptions?: StrategyOptions): string {
    const stratOrFn = this.chooseStrategy([strategyOptions?.string, strategyOptions?.overall]);
    if (this.isFunction(stratOrFn)) {
      const fn = stratOrFn as any;
      return fn(str);
    }
    const strategy = stratOrFn as any;
    if (strategy === DataMaskingStrategy.Identity) {
      return str;
    }
    if (strategy === DataMaskingStrategy.Nullify) {
      return '';
    }
    if (strategy === DataMaskingStrategy.Scramble) {
      return this.maskStrScramble(str);
    }
    if (strategy === DataMaskingStrategy.Md5) {
      throw new Error('Md5 string path not implemented');
    }
    throw new Error(
      'No valid strategy found for strings.\nStrategies given: ' + strategyOptions + '\nstring to mask: ' + str
    );
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
      newString = stringArray.sort(() => Math.random() - 0.5).join('');
    } while (newString === str);
    return newString;
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

export enum DataMaskingStrategy {
  Identity,
  Scramble,
  Md5,
  Nullify,
  // Deep,
}

const DataMaskingStrategyList = [
  DataMaskingStrategy.Identity,
  DataMaskingStrategy.Scramble,
  DataMaskingStrategy.Md5,
  DataMaskingStrategy.Nullify,
  // DataMaskingStrategy.Deep // will be used to mask things inside lists and jsons even if json and list have a masking strategy of their own
];

export interface StrategyOptions {
  overall?: DataMaskingStrategy | ((originalOverall: any) => any);
  json?: DataMaskingStrategy | ((originalJson: any) => any);
  string?: DataMaskingStrategy | ((originalString: string) => string);
  number?: DataMaskingStrategy | ((originalNumber: number) => number);
  boolean?: DataMaskingStrategy | ((originalBoolean: boolean) => boolean);
  date?: DataMaskingStrategy | ((originalDate: string) => string);
  html?: DataMaskingStrategy | ((originalHtml: string) => string);
  list?: DataMaskingStrategy | ((originalList: any) => any);
}
