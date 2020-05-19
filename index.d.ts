/**
 * Implement in order to use the MigrationHandler
 */
export interface IJsonMigrator {
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
 * A collection of ways to alter and compare jsons.
 */
export class JsonRefactor {
  /**
   * Create a copy of a json
   *
   * @param json
   */
  public copy(json: any): any;

  /**
   * Adds a field to a json. Can also be used to set a field.
   *
   * @param json
   * @param key
   * @param value
   */
  public addField(json: any, key: string, value: any): any;

  /**
   * Removes a field from a json.
   *
   * @param json
   * @param key
   */
  public removeField(json: any, key: string): any;

  /**
   * Sets a field in a json. Can also be used to add a field.
   *
   * @param json
   * @param key
   * @param value
   */
  public setField(json: any, key: string, value: any): any;

  /**
   * Compares 2 jsons based on keys alone.
   *
   * @param json1
   * @param json2
   */
  public sameKeys(json1: any, json2: any): boolean;

  private isSubsetGeneral(subJson: any, superJson: any, compareFn): boolean;

  /**
   * Check if a json is a subset of another json.
   *
   * @param subJson
   * @param superJson
   */
  public isSubset(subJson: any, superJson: any): boolean;

  /**
   * Check if a json is a subset of another json based on keys
   *
   * @param subJson
   * @param superJson
   */
  public isSubsetKeys(subJson: any, superJson: any): boolean;

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
    subJson: any,
    superJson: any,
    specialSubKeys: string[],
    specialFns: Array<(subValue: any, superValue: any) => boolean>,
    specialSuperKeys: string[],
    compareRest: boolean
  ): boolean;

  /**
   * Creates a subset json based on what keys you want to keep from the original json.
   *
   * @param json
   * @param keys
   */
  public subJson(json: any, keys: string[]): any;

  /**
   * Ignores order.
   *
   * Checks if all elements from the subset array exist in the super set array.
   *
   * @param subArray
   * @param superArray
   */
  public isSubsetArray(subArray: any[], superArray: any[]): boolean;

  /**
   * Ignores order.
   *
   * Checks if all elements of the first array exist in the second array and
   * Checks if all elements from the second array exist in the first array.
   *
   * @param array1
   * @param array2
   */
  public containSameElements(array1: any[], array2: any[]): boolean;

  /**
   * Creates a subset json based on what keys you want to exclude from the original json.
   *
   * @param json
   * @param keys
   */
  public subJsonExcept(json: any, keys: string[]): any;

  /**
   * Converts a json to a key value json pair list
   *
   * @param json
   */
  public toKeyValArray(json: any): Array<{ key: string; value: any }>;

  /**
   * Converts a key value json pair list to a json
   *
   * @param keyValueArray
   */
  public fromKeyValArray(keyValueArray: Array<{ key: string; value: any }>): any;
}
