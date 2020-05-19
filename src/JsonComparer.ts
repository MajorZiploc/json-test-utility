import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';

/**
 * A collection of ways to compare jsons.
 */
class JsonComparer {
  private isSubsetGeneral(subJson, superJson, compareFn) {
    const subKVA = jr.toKeyValArray(subJson);
    const superKVA = jr.toKeyValArray(superJson);
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
      const stdSubEntries = jr.toKeyValArray(jr.subJsonExcept(subJson, specialSubKeys));
      const stdSupEntries = jr.toKeyValArray(jr.subJsonExcept(superJson, specialSuperKeys));
      return didSpecialsPass && this.isSubset(stdSubEntries, stdSupEntries);
    }
    return didSpecialsPass;
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
}

export const jsonComparer = new JsonComparer();
