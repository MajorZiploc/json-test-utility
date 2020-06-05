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

  public sameTypes(thing1: any, thing2: any): boolean {
    if (Array.isArray(thing1) && Array.isArray(thing2)) {
      return this.sameTypesList(thing1, thing2);
    }
    if (Array.isArray(thing1) || Array.isArray(thing2)) {
      return false;
    }
    if (this.isJSON(thing1) && this.isJSON(thing2)) {
      if (this.sameKeys(thing1, thing2)) {
        const j1kva = jr.toKeyValArray(thing1).sort((kv1, kv2) => kv1.key.localeCompare(kv2.key));
        const j2kva = jr.toKeyValArray(thing2).sort((kv1, kv2) => kv1.key.localeCompare(kv2.key));
        if (j1kva.length != j2kva.length) {
          return false;
        }
        const j1kvAndj2kv_s = _.zipWith(j1kva, j2kva, (j1kv, j2kv) => ({ j1kv, j2kv }));
        return j1kvAndj2kv_s.every(j1kvAndj2kv => this.sameTypes(j1kvAndj2kv.j1kv.value, j1kvAndj2kv.j2kv.value));
      }
      return false;
    }
    if (this.isJSON(thing1) || this.isJSON(thing2)) {
      return false;
    }
    return typeof thing1 === typeof thing2;
  }

  private sameTypesList(list1: any[], list2: any[]): boolean {
    if (list1.length != list2.length) {
      return false;
    }
    const lsz = _.zipWith(list1, list2, (e1, e2) => ({ e1, e2 }));
    return lsz.every(lz => this.sameTypes(lz.e1, lz.e2));
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
