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
  maskData(json: any, strategyOptions?: StrategyOptions) {
    return this.maskDataHelper(json, strategyOptions);
  }
  private maskDataHelper(json: any, strategyOptions?: StrategyOptions) {
    if (Array.isArray(json)) {
      return this.maskList(json, strategyOptions);
    } else {
      return this.maskJson(json, strategyOptions);
    }
  }

  maskList(list: any[], strategyOptions?: StrategyOptions): any[] {
    return list.map(element => {
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

  maskJson(json: any, strategyOptions?: StrategyOptions): any {
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

  maskNumber(num: number, strategyOptions?: StrategyOptions) {
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

  maskString(str: string, strategyOptions?: StrategyOptions): string {
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

  allNumbersSame(num: string) {
    let numArray = num.split('');
    for (let i = 0; i < numArray.length; i++) {
      if (numArray[i] !== numArray[i + 1]) {
        return false;
      }
    }
    return true;
  }

  allCharsSame(str: string) {
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
}

export interface StrategyOptions {
  overall?: DataMaskingStrategy | ((originalJson: any) => any);
  string?: DataMaskingStrategy | ((originalString: string) => string);
  number?: DataMaskingStrategy | ((originalNumber: number) => number);
  boolean?: DataMaskingStrategy | ((originalBoolean: boolean) => boolean);
  date?: DataMaskingStrategy | ((originalDate: string) => string);
  html?: DataMaskingStrategy | ((originalHtml: string) => string);
}
