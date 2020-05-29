import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';
import { jsonComparer as jc } from './JsonComparer';

class JsonMasker {
  maskData(json: any) {
    return this.maskDataHelper(json);
  }
  private maskDataHelper(json: any) {
    if (Array.isArray(json)) {
      return this.maskList(json);
    } else {
      return this.maskJson(json);
    }
  }

  maskList(list: any[]): any[] {
    return list.map(element => {
      if (Array.isArray(element)) {
        return this.maskList(element);
      } else if (jc.isJSON(element)) {
        return this.maskJson(element);
      } else if (isNaN(element)) {
        return this.maskString(element);
      } else {
        return this.maskNumber(element);
      }
    });
  }

  maskJson(json: any): any {
    const jsonArray = jr.toKeyValArray(json);
    return jr.fromKeyValArray(
      jsonArray.map(element => {
        if (Array.isArray(element.value)) {
          return { key: element.key, value: this.maskList(element.value) };
        } else if (isNaN(element.value)) {
          return { key: element.key, value: this.maskString(element.value) };
        } else {
          return { key: element.key, value: this.maskNumber(element.value) };
        }
      })
    );
  }

  maskNumber(num: number): number {
    const numStr = num.toString();
    const matchList = numStr.match(/(-)?(\d+)(\.)?(\d*)/);
    const sign = matchList[1] ?? '';
    const wholeNumber = matchList[2] ?? '0';
    const decemialPoint = matchList[3] ?? '';
    const decemialValue = matchList[4] ?? '';

    // if match group is not found, then it is undefined or ''?

    // if (num.toString().length === 1) {
    //   return num * 11;
    // } else {
    //   let numString = num.toString();
    //   let numStringArray = [];
    //   let newNum;
    //   if (num % 1 !== 0 && num < -1) {
    //     numStringArray = numString.split('');
    //     numStringArray.shift();
    //     numString = numStringArray.join();
    //     numString.split('.');
    //   } else if (num % 1 !== 0) {
    //   } else if (num < 1) {
    //   } else {
    //     while (newNum !== Number(numString)) {
    //       numStringArray = numString.split('');
    //       numStringArray.sort(() => Math.random() - 0.5);
    //     }
    //     return newNum;
    //   }
    // }
  }

  maskString(str: string): string {
    if (str === '') {
      // pick a return char
      //return it
    }
    let newString;
    while (newString !== str) {
      let stringArray = str.split('');
      newString = stringArray.sort(() => Math.random() - 0.5).join('');
    }
    return newString;
  }
}

export const jsonMasker = new JsonMasker();
