import * as _ from 'lodash';

/**
 * A collection of ways to alter and compare jsons.
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
    return this.isSubsetKeys(json1, json2) && this.isSubsetKeys(json2, json1);
  }

  private isSubsetGeneral(subJson, superJson, compareFn) {
    const subKVA = this.toKeyValArray(subJson);
    const superKVA = this.toKeyValArray(superJson);
    return subKVA.every(subKv => superKVA.some(supKv => compareFn(subKv, supKv)));
  }

  /**
   * Check if a json is a subset of another json.
   *
   * @param subJson
   * @param superJson
   */
  public isSubset(subJson, superJson) {
    return this.isSubsetGeneral(subJson, superJson, _.isEqual);
  }

  /**
   * Check if a json is a subset of another json based on keys
   *
   * @param subJson
   * @param superJson
   */
  public isSubsetKeys(subJson, superJson) {
    return this.isSubsetGeneral(subJson, superJson, (sub, sup) => _.isEqual(sub.key, sup.key));
  }

  /**
   *
   * json subset check with extra flexiablity.
   *
   * @param subJson
   * @param superJson
   * @param specialSubKeys
   *  (Ordered List) Keys from the subset json that will be compared in a special way.
   * @param specialFns
   *  (Ordered List) The special way in which special subset and superset json values will be compared.
   * @param specialSuperKeys
   *  (Ordered List) Keys from the subset json that will be compared in a special way.
   * @param compareRest
   *  A flag that states if the rest (non special) of the values in the json should be compared based on strict equalivence
   */
  public isSubsetSpecialCases(
    subJson,
    superJson,
    specialSubKeys: string[],
    specialFns: Array<(subValue: any, superValue: any) => boolean>,
    specialSuperKeys: string[] = specialSubKeys,
    compareRest = true
  ) {
    const specialEntries: Array<{
      subKey: string;
      superKey: string;
      fn: (subValue: any, superValue: any) => boolean;
    }> = _.zipWith(specialSubKeys, specialSuperKeys, specialFns, (subKey, superKey, fn) => ({ subKey, superKey, fn }));
    const didSpecialsPass: boolean = specialEntries.every(e => e.fn(subJson[e.subKey], superJson[e.superKey]));
    if (!didSpecialsPass) {
      return didSpecialsPass;
    }
    if (compareRest) {
      const stdSubEntries = this.toKeyValArray(this.subJsonExcept(subJson, specialSubKeys));
      const stdSupEntries = this.toKeyValArray(this.subJsonExcept(superJson, specialSuperKeys));
      return didSpecialsPass && this.isSubset(stdSubEntries, stdSupEntries);
    }
    return didSpecialsPass;
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
   * Ignores order.
   *
   * Checks if all elements from the subset array exist in the super set array.
   *
   * @param subArray
   * @param superArray
   */
  public isSubsetArray(subArray: any[], superArray: any[]) {
    return subArray.every(subV => superArray.some(supV => _.isEqual(subV, supV)));
  }
  /**
   * Ignores order.
   *
   * Checks if all elements of the first array exist in the second array and
   * Checks if all elements from the second array exist in the first array.
   *
   * @param array1
   * @param array2
   */
  public containSameElements(array1: any[], array2: any[]) {
    return this.isSubsetArray(array1, array2) && this.isSubsetArray(array1, array2);
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

export const jr = new JsonRefactor();
