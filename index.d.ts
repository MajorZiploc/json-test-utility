export interface sameTypeOptions {
  nullableKeys?: string[];
  checkFirstInList?: boolean;
  subsetListCheck?: boolean;
  emptyListIsAcceptable?: boolean;
  dateKeys?: string[];
}

export interface typeCheckerOptions {
  nullableKeys?: string[];
  dateKeys?: string[];
  emptyRootListAcceptable?: boolean;
  emptyListKeys?: string[];
}

export class Variable {
  toString(varInJson: any): string | null;

  splitCamelCase(varInJson: any, separator?: string): string | null;
}

export class List {
  /**
   * Sorts by ascending order be default using <= operator
   *
   * @param arr
   * @param comparer
   */
  isSorted(arr: any[], comparer?: (f: any, s: any) => boolean): boolean;

  isSortedAsc(arr: any[]): boolean;

  isSortedDesc(arr: any[]): boolean;
}

export class String {
  titleCase(str: string): string | null;

  splitCamelCase(varInJson: any, separator?: string): string | null;
}

/**
 * Implement in order to use the MigrationHandler
 */
export class IJsonMigrator {
  /**
   *
   * @param json The json to be migrated
   * @returns a json with the migrations applied based on the input json
   */
  apply(json: any): any;
  /**
   * @returns A description of the migration that is applied to the input json.
   */
  description(): string;
}

/**
 * Implement in order to use the MigrationHandler if each of the jsons is a list of jsons
 *
 * @param eleMigrator A jsonmigrator object that operates on a single json from the json list
 * @returns
 *  A jsonMigrator that operates on a list of jsons.
 */
export function ListOfJsonMigratorOf(eleMigrator: IJsonMigrator): IJsonMigrator;

export enum DataMaskingStrategy {
  Identity,
  Scramble,
  Nullify,
  // Deep,
}

export interface StrategyOptions {
  overall?: DataMaskingStrategy;
  json?: DataMaskingStrategy | ((originalJson: any) => any);
  string?: DataMaskingStrategy | ((originalString: string) => string);
  number?: DataMaskingStrategy | ((originalNumber: number) => number);
  boolean?: DataMaskingStrategy | ((originalBoolean: boolean) => boolean);
  list?: DataMaskingStrategy | ((originalList: any[]) => any[]);
  // date?: DataMaskingStrategy | ((originalDate: string) => string);
  // html?: DataMaskingStrategy | ((originalHtml: string) => string);
}

declare class JsonMasker {
  maskData(json: any, strategyOptions?: StrategyOptions);
}

declare class JsonMigration {
  /**
   *
   * This operation in immutable
   *
   *
   * @param jsons - list of jsons to migrate
   * @param migrators
   *  list of migrators that take old jsons and create new jsons based on them.
   *  its an order list where the created json of one migrator becomes the old json/input of the next
   */
  migrateJsons(jsons: any[], migrators: IJsonMigrator[]): any[];
}

/**
 * A collection of ways to alter and compare jsons.
 */
declare class JsonRefactor {
  /**
   * Create a copy of a json
   *
   * @param json
   */
  copy(json: any): any;

  /**
   * Adds a field to a json. Can also be used to set a field.
   *
   * @param json
   * @param key
   * @param value
   */
  addField(json: any, key: string, value: any): any;

  /**
   * Removes a field from a json.
   *
   * @param json
   * @param key
   */
  removeField(json: any, key: string): any;

  /**
   * Sets a field in a json. Can also be used to add a field.
   *
   * @param json
   * @param key
   * @param value
   */
  setField(json: any, key: string, value: any): any;

  /**
   * Creates a subset json based on what keys you want to keep from the original json.
   *
   * @param json
   * @param keys
   */
  subJson(json: any, keys: string[]): any;

  /**
   * Creates a subset json based on what keys you want to exclude from the original json.
   *
   * @param json
   * @param keys
   */
  subJsonExcept(json: any, keys: string[]): any;

  /**
   * Converts a json to a key value json pair list
   *
   * @param json
   */
  toKeyValArray(json: any): Array<{ key: string; value: any }>;

  /**
   * Converts a key value json pair list to a json
   *
   * @param keyValueArray
   */
  fromKeyValArray(keyValueArray: Array<{ key: string; value: any }>): any;

  /**
   *
   * Combines jsons as long as they do not share the same key names
   *
   * @param json1
   * @param json2
   * @returns json1 + json2
   * @throws an Error if there are any keys that are the same
   */
  concatJsons(json1: any, json2: any): any;

  /**
   *
   * Removes keys that exist in both json1 and json2 from json1.
   * Then returns the rest of json1.
   * Values will be from json1
   *
   * returnJson = json1 - json2
   *
   * @param json1
   * @param json2
   * @returns json1 - json2
   */
  minusJsons(json1: any, json2: any): any;
}

/**
 * A collection of ways to compare jsons.
 */
declare class JsonComparer {
  /**
   * Compares 2 jsons based on keys alone.
   *
   * @param json1
   * @param json2
   */
  sameKeys(json1: any, json2: any): boolean;

  /**
   * Check if a json is a subset of another json with the comparer function.
   *
   * NOTE: This function is used on every value in the json.
   *
   * @param subJson
   * @param superJson
   * @param compareFn How to compare the values from each json
   */
  isSubsetWith(subJson: any, superJson: any, compareFn: (f: any, s: any) => boolean): boolean;

  /**
   * Check if a json is a subset of another json through strict equivalence
   *
   * @param subJson
   * @param superJson
   */
  isSubset(subJson: any, superJson: any): boolean;

  /**
   * Check if a json is a subset of another json based on keys
   *
   * @param subJson
   * @param superJson
   */
  isSubsetKeys(subJson: any, superJson: any): boolean;

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
  isSubsetSpecialCases(
    subJson: any,
    superJson: any,
    specialSubKeys: string[],
    specialFns: Array<(subValue: any, superValue: any) => boolean>,
    specialSuperKeys?: string[],
    compareRest?: boolean
  ): boolean;

  /**
   * Ignores order.
   *
   * Checks if all elements from the subset array exist in the super set array.
   *
   * @param subArray
   * @param superArray
   */
  isSubsetArray(subArray: any[], superArray: any[]): boolean;

  /**
   *
   * Ignores order.
   *
   * Checks if all elements of the first array exist in the second array and
   * Checks if all elements from the second array exist in the first array.
   *
   * NOTE: uses the comparer function to do the comparsion for each element
   *
   * @param array1
   * @param array2
   * @param comparer how each element is compared
   */
  containSameElementsWith(array1: any[], array2: any[], comparer: (f: any, s: any) => boolean): boolean;

  /**
   * Ignores order.
   *
   * Checks if all elements of the first array exist in the second array and
   * Checks if all elements from the second array exist in the first array.
   *
   * @param array1
   * @param array2
   */
  containSameElements(array1: any[], array2: any[]): boolean;

  /**
   * Check if something is a json.
   *
   * @param thing to be checked
   * @returns true if is a json, else false
   */
  isJSON(thing: any): boolean;

  /**
   * Recursive by default
   * Find key paths in a json that match the provided regex
   *
   * @param json the json to search for key matches
   * @param regexKeyPattern standard regex pattern. ex: ^.{1,}z*a?[\\w\\d]$
   * @param regexOptions standard regex options like, g and i
   * @param deepCheck defaults to true
   * @returns list of key paths where the pattern was found in the json
   */
  findAllKeyPaths(json: any, regexKeyPattern: string, regexOptions?: string, deepCheck?: boolean): string[];

  /**
   * Checks if both things have the same type.
   * Recursively checks the whole structure based on if they are lists or jsons.
   *
   * @param thing1
   * @param thing2
   */
  sameTypes(thing1: any, thing2: any, options?: sameTypeOptions): boolean;

  /**
   * Used to type check api contracts.
   *
   * @param json json to type check
   * @param contractJson contract to use for type checking against json
   * @param options type checking options
   *
   * @returns true if the json type checks, else false
   */
  typecheck(json: any, contractJson: any, options?: typeCheckerOptions): boolean;
}

export const jsonComparer: JsonComparer;

export const jsonRefactor: JsonRefactor;

export const jsonMigration: JsonMigration;

export const jsonMasker: JsonMasker;

export const variable: Variable;

export const string: String;

export const list: List;
