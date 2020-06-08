import * as _ from 'lodash';
import { jsonRefactor as jr } from './JsonRefactor';

interface TypeCheckerOptions {
  nullableKeys?: string[];
  checkFirstInList?: boolean;
  subsetListCheck?: boolean;
  emptyListIsAcceptable?: boolean;
}

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

  public sameTypes(thing1: any, thing2: any, options?: TypeCheckerOptions): boolean {
    if (Array.isArray(thing1) && Array.isArray(thing2)) {
      return this.sameTypesList(thing1, thing2, options);
    }
    if (Array.isArray(thing1) || Array.isArray(thing2)) {
      return false;
    }
    if (this.isJSON(thing1) && this.isJSON(thing2)) {
      if (this.sameKeys(thing1, thing2)) {
        // Check key paths that have no dots.
        const rootKeyPaths = options?.nullableKeys?.filter(k => k.split('.').length <= 1) ?? [];
        // Removes 1 layer of key paths.
        const nullKeys = options?.nullableKeys
          ?.map(k => k.split('.').slice(1).join('.'))
          .filter(k => !_.isEqual(k, ''));
        const opts = jr.setField(options, 'nullableKeys', nullKeys);
        const doesNullableRootKeysTypeCheck = rootKeyPaths.every(k => {
          const v1 = thing1[k];
          const v2 = thing2[k];
          if (v1 === null && v2 === null) {
            return true;
          }
          if (v1 === null || v2 === null) {
            return true;
          } else {
            return this.sameTypes(v1, v2, opts);
          }
        });
        if (doesNullableRootKeysTypeCheck === false) {
          return false;
        }
        const j1kva = jr
          .toKeyValArray(thing1)
          .sort((kv1, kv2) => kv1.key.localeCompare(kv2.key))
          .filter(kv => !rootKeyPaths.some(rk => rk === kv.key));
        const j2kva = jr
          .toKeyValArray(thing2)
          .sort((kv1, kv2) => kv1.key.localeCompare(kv2.key))
          .filter(kv => !rootKeyPaths.some(rk => rk === kv.key));
        if (j1kva.length != j2kva.length) {
          return false;
        }
        const j1kvAndj2kv_s = _.zipWith(j1kva, j2kva, (j1kv, j2kv) => ({ j1kv, j2kv }));
        return j1kvAndj2kv_s.every(j1kvAndj2kv => this.sameTypes(j1kvAndj2kv.j1kv.value, j1kvAndj2kv.j2kv.value, opts));
      }
      return false;
    }
    if (this.isJSON(thing1) || this.isJSON(thing2)) {
      return false;
    }
    return typeof thing1 === typeof thing2;
  }

  private sameTypesList(list1: any[], list2: any[], options?: TypeCheckerOptions): boolean {
    if (options?.subsetListCheck ?? false) {
      const trimedList2 = list2.slice(0, list1.length);
      const lsz = _.zipWith(list1, trimedList2, (e1, e2) => ({ e1, e2 }));
      return lsz.every(lz => this.sameTypes(lz.e1, lz.e2, options));
    }
    // Should only check first in list
    if (options?.checkFirstInList ?? false) {
      if (list1.length === 0 || list1.length === 0) {
        return options?.emptyListIsAcceptable ?? false;
      }
      if (list1.length === 0 && list1.length === 0) {
        return options?.emptyListIsAcceptable ?? false;
      }
      const first1 = list1[0];
      const first2 = list2[0];
      return this.sameTypes(first1, first2, options);
    }
    if (options?.emptyListIsAcceptable ?? false) {
      if (list1.length === 0 || list2.length === 0) {
        return true;
      }
    }
    if (list1.length != list2.length) {
      return false;
    }
    const lsz = _.zipWith(list1, list2, (e1, e2) => ({ e1, e2 }));
    return lsz.every(lz => this.sameTypes(lz.e1, lz.e2, options));
  }

  public findAllKeyPaths(json: any, regexKeyPattern: string, regexOptions?: string, deepCheck?: boolean) {
    const isJson = this.isJSON.bind(this);
    const shouldRecur = deepCheck ?? true;
    const regex = regexOptions == null ? new RegExp(regexKeyPattern) : new RegExp(regexKeyPattern, regexOptions);
    function findAllHelper(json: any, currentPath: string, isJson) {
      const kva = jr.toKeyValArray(json);
      const currentPathStr = currentPath == null ? '' : currentPath + '.';
      // check root keys of the json for matches
      const shallowKeyPaths = kva.filter(kv => kv.key.match(regex)).map(kv => currentPathStr + kv.key);
      // check values for jsons
      const deepPaths = shouldRecur
        ? _.flatten(
            kva.filter(kv => isJson(kv.value)).map(kv => findAllHelper(kv.value, currentPathStr + kv.key, isJson))
          )
        : [];
      return shallowKeyPaths.concat(deepPaths);
    }
    return _.flatten(
      jr
        .toKeyValArray(_.groupBy(findAllHelper(json, null, isJson), s => s.split('.').length))
        .map(kv => kv.value.sort())
    );
  }
}

export const jsonComparer = new JsonComparer();
