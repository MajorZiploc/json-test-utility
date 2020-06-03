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
        } else if (jc.isJSON(element.value)) {
          return { key: element.key, value: this.maskJson(element.value) };
        } else if (isNaN(element.value)) {
          return { key: element.key, value: this.maskString(element.value) };
        } else {
          return { key: element.key, value: this.maskNumber(element.value) };
        }
      })
    );
  }

  maskNumber(num: number) {
    const numStr = num.toString();
    const matchList = numStr.match(/(-)?(\d+)(\.)?(\d*)/);
    const sign = matchList[1] ?? '';
    const wholeNumber = matchList[2] ?? '0';
    const decimalPoint = matchList[3] ?? '';
    const decimalValue = matchList[4] ?? '';
    let newWholeNumber;
    let newDecimalValue;
    
    do {
      if(numStr.length === 1){
        newWholeNumber = num * 11; 
      } else {
        if(this.allNumbersSame(wholeNumber)){
          newWholeNumber = wholeNumber + '0'
        } else {
          newWholeNumber = wholeNumber.split('').sort(() => Math.random() - 0.5).join('');
        }
      }
    } while(newWholeNumber === wholeNumber)
    if(decimalValue !== ""){
      do {
        if(this.allNumbersSame(decimalValue)){
          newDecimalValue = '0' + decimalValue
        } else {
          newDecimalValue = wholeNumber.split('').sort(() => Math.random() - 0.5).join('');
        }
      } while(decimalValue === newDecimalValue)
      return Number(sign + newWholeNumber + decimalPoint + newDecimalValue);
    }
    return Number(sign + newWholeNumber);
  }

  maskString(str: string): string {
    let strObj = _.groupBy(('three'.split('').map((c,i) => ({c,i}))), j => j.c)
    let newString;
    let stringArray = str.split('');
    if (str === "" || !(/\S/.test(str))) {
      return Math.random().toString(36).slice(-5);
    } else if(str.length === 1){
      return str + str;
    } else if(this.allCharsSame(str)){
      return Math.random().toString(36).slice(-(str.length));
    }
    do {
      newString = stringArray.sort(() => Math.random() - 0.5).join('');
    } while (newString === str)
    return newString;
  }

  allNumbersSame(num: string){
    let numArray = num.split("");
    for(let i = 0; i < numArray.length; i++){
      if(numArray[i] !== numArray[i + 1]){
        return false;
      }
    }
    return true;
  }

  allCharsSame(str: string){
    let strArray = str.split('');
    for(let i = 0; i < strArray.length; i++){
      if(strArray[i] !== strArray[i + 1]){
        return false;
      }
    }
    return true;
  }
}

export const jsonMasker = new JsonMasker();
