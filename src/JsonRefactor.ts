import * as _ from 'lodash';
import { jsonComparer as jc } from './JsonComparer';

class JsonRefactor {
  public copy(json) {
    return _.clone(json);
  }

  public addField(json, key, value) {
    const r = this.copy(json);
    return _.set(r, key, value);
  }

  public removeField(json, key) {
    const r = this.copy(json);
    _.unset(r, key);
    return r;
  }

  public setField(json, key, value) {
    return this.addField(json, key, value);
  }

  public sameKeys(json1, json2) {
    return jc.isSubsetKeys(json1, json2) && jc.isSubsetKeys(json2, json1);
  }

  public subJson(json, keys: string[]) {
    return this.fromKeyValArray(this.toKeyValArray(json).filter(kv => keys.some(k => _.isEqual(k, kv.key))));
  }

  public subJsonExcept(json, keys: string[]) {
    return this.fromKeyValArray(this.toKeyValArray(json).filter(kv => !keys.some(k => _.isEqual(k, kv.key))));
  }

  public toKeyValArray(json) {
    return Object.entries(json).map(e => ({ key: e[0], value: e[1] }));
  }

  public fromKeyValArray(keyValueArray: Array<{ key: string; value: any }>) {
    return keyValueArray.reduce((acc, ele) => this.addField(acc, ele.key, ele.value), {});
  }
}

export const jsonRefactor = new JsonRefactor();
