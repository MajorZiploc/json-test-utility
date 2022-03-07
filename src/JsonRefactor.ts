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

  public subJson(json, keys: string[]) {
    return this.fromKeyValArray(this.toKeyValArray(json).filter(kv => keys.some(k => _.isEqual(k, kv.key))));
  }

  public subJsonExcept(json, keys: string[]) {
    return this.fromKeyValArray(this.toKeyValArray(json).filter(kv => !keys.some(k => _.isEqual(k, kv.key))));
  }

  public toKeyValArray(json: any): Array<{ key: string; value: any }> {
    if (json === null || json === undefined) {
      return json;
    }
    return Object.keys(json).map(key => ({ key: key, value: json[key] }));
  }

  public fromKeyValArray(keyValueArray: Array<{ key: string; value: any }>) {
    if (keyValueArray === null || keyValueArray === undefined) {
      return keyValueArray;
    }
    return keyValueArray.reduce((acc, ele) => this.addField(acc, ele.key, ele.value), {});
  }

  public concatJsons(json1: any, json2: any): any {
    const kva1 = this.toKeyValArray(json1);
    const kva2 = this.toKeyValArray(json2);
    const joinedKVA = kva1.concat(kva2);
    const groupedByKey = _.groupBy(joinedKVA, kv => kv.key);
    const duppedEntries = this.toKeyValArray(groupedByKey).filter(g => g.value.length > 1);
    if (duppedEntries.length > 0) {
      throw new Error(
        'The two jsons that are being combined have keys in common.\nCommon keys:\n' +
          duppedEntries.map(e => e.key).join('\n')
      );
    } else {
      return this.fromKeyValArray(joinedKVA);
    }
  }

  public minusJsons(json1: any, json2: any): any {
    const kva1 = this.toKeyValArray(json1);
    const kva2 = this.toKeyValArray(json2);
    const filteredKVA1 = kva1.filter(kv1 => !kva2.some(kv2 => _.isEqual(kv1.key, kv2.key)));
    return this.fromKeyValArray(filteredKVA1);
  }
}

export const jsonRefactor = new JsonRefactor();
