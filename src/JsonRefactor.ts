import * as _ from 'lodash';
import { jsonComparer as jc } from './JsonComparer';

/**
 * A collection of ways to alter jsons.
 */
class JsonRefactor {
  /**
   * Create a copy of a json
   *
   * @param json
   */
  public copy(json) {
    return _.clone(json);
  }

  /**
   * Adds a field to a json. Can also be used to set a field.
   *
   * @param json
   * @param key
   * @param value
   */
  public addField(json, key, value) {
    const r = this.copy(json);
    return _.set(r, key, value);
  }

  /**
   * Removes a field from a json.
   *
   * @param json
   * @param key
   */
  public removeField(json, key) {
    const r = this.copy(json);
    _.unset(r, key);
    return r;
  }

  /**
   * Sets a field in a json. Can also be used to add a field.
   *
   * @param json
   * @param key
   * @param value
   */
  public setField(json, key, value) {
    return this.addField(json, key, value);
  }

  /**
   * Compares 2 jsons based on keys alone.
   *
   * @param json1
   * @param json2
   */
  public sameKeys(json1, json2) {
    return jc.isSubsetKeys(json1, json2) && jc.isSubsetKeys(json2, json1);
  }

  /**
   * Creates a subset json based on what keys you want to keep from the original json.
   *
   * @param json
   * @param keys
   */
  public subJson(json, keys: string[]) {
    return this.fromKeyValArray(this.toKeyValArray(json).filter(kv => keys.some(k => _.isEqual(k, kv.key))));
  }

  /**
   * Creates a subset json based on what keys you want to exclude from the original json.
   *
   * @param json
   * @param keys
   */
  public subJsonExcept(json, keys: string[]) {
    return this.fromKeyValArray(this.toKeyValArray(json).filter(kv => !keys.some(k => _.isEqual(k, kv.key))));
  }

  /**
   * Converts a json to a key value json pair list
   *
   * @param json
   */
  public toKeyValArray(json) {
    return Object.entries(json).map(e => ({ key: e[0], value: e[1] }));
  }

  /**
   * Converts a key value json pair list to a json
   *
   * @param keyValueArray
   */
  public fromKeyValArray(keyValueArray: Array<{ key: string; value: any }>) {
    return keyValueArray.reduce((acc, ele) => this.addField(acc, ele.key, ele.value), {});
  }
}

export const jsonRefactor = new JsonRefactor();
