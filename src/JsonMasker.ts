import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';
import { jsonComparer as jc } from './JsonComparer';

class JsonMasker {
  maskData(json: any) {
    return this.maskDataHelper(json);
  }
  private maskDataHelper(json: any) {
    // check if its a list
    // call maskList(json)
    // check if its a json
    // jc.isJSON
    // call maskJson(json)
  }
  maskList(list: any[]): any[] {
    return [];
  }
  maskJson(json: any): any {
    // jr.toKeyValArray;
    // jr.fromKeyValArray;
  }
  maskNumber(num: number): number {
    return 0;
  }
  maskString(str: string): string {
    return '';
  }
}

export const jsonMasker = new JsonMasker();
