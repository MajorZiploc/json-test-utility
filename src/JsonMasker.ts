import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';
import { jsonComparer as jc } from './JsonComparer';

class JsonMasker {
  maskData(json: any) {
    return this.maskDataHelper(json);
  }
  private maskDataHelper(json: any) {
    if(Array.isArray(json)){
      this.maskList(json);
    } else if (json.isJSON) {
      this.maskJson(json);
    } else {

    }
  }
  maskList(list: any[]): any[] {
    return [];
  }
  maskJson(json: any): any {
      if (Array.isArray(json)){
        this.maskList(json)
      }
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
