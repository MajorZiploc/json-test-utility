import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';

class JsonComparer {
  public isSubsetWith(subJson: any, superJson: any, compareFn: (f: any, s: any) => boolean) {
    const subKVA = jr.toKeyValArray(subJson);
    const superKVA = jr.toKeyValArray(superJson);
    return subKVA.every(subKv => superKVA.some(supKv => compareFn(subKv, supKv)));
  }

  public isSubset(subJson, superJson) {
    return this.isSubsetWith(subJson, superJson, _.isEqual);
  }

  public isSubsetKeys(subJson, superJson) {
    return this.isSubsetWith(subJson, superJson, (sub, sup) => _.isEqual(sub.key, sup.key));
  }

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
      const stdSubEntries = jr.toKeyValArray(jr.subJsonExcept(subJson, specialSubKeys));
      const stdSupEntries = jr.toKeyValArray(jr.subJsonExcept(superJson, specialSuperKeys));
      return didSpecialsPass && this.isSubset(stdSubEntries, stdSupEntries);
    }
    return didSpecialsPass;
  }

  public isSubsetArrayWith(subArray: any[], superArray: any[], comparer: (f: any, s: any) => boolean) {
    return subArray.every(subV => superArray.some(supV => comparer(subV, supV)));
  }

  public isSubsetArray(subArray: any[], superArray: any[]) {
    return this.isSubsetArrayWith(subArray, superArray, _.isEqual);
  }

  public containSameElementsWith(array1: any[], array2: any[], comparer: (f: any, s: any) => boolean) {
    return this.isSubsetArrayWith(array1, array2, comparer) && this.isSubsetArrayWith(array1, array2, comparer);
  }

  public containSameElements(array1: any[], array2: any[]) {
    return this.containSameElementsWith(array1, array2, _.isEqual);
  }

  public sameKeys(json1, json2) {
    return this.isSubsetKeys(json1, json2) && this.isSubsetKeys(json2, json1);
  }
  public isJSON(thing: any): boolean {
    let m = thing;
    if (typeof m == 'object') {
      try {
        m = JSON.stringify(m);
      } catch (err) {
        return false;
      }
    }
    if (typeof m == 'string') {
      try {
        m = JSON.parse(m);
      } catch (err) {
        return false;
      }
    }
    if (typeof m != 'object') {
      return false;
    }
    return true;
  }
}

export const jsonComparer = new JsonComparer();
