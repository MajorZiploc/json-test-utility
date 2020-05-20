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

declare class MigrationHandler {
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

  /**
   * Create a log file of all alterations to be made to the jsons.
   *
   * @param migrators
   */
  logMigration(migrators: IJsonMigrator[]): Promise<void>;

  /**
   * 1. Reads a folder and grabs ALL files in that folder and expects them to be jsons.
   * 2. Performs the migration
   * 3. logs the migration if wanted
   *
   * @param folderPath
   * @param migrators
   * @param shouldLog
   */
  migrateFolder(folderPath: string, migrators: IJsonMigrator[], shouldLog?: boolean): Promise<void>;
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
   * Compares 2 jsons based on keys alone.
   *
   * @param json1
   * @param json2
   */
  sameKeys(json1: any, json2: any): boolean;

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
}

/**
 * A collection of ways to compare jsons.
 */
class JsonComparer {
  /**
   * Check if a json is a subset of another json with the comparer function.
   *
   * NOTE: This function is used on every value in the json.
   *
   * @param subJson
   * @param superJson
   * @param compareFn How to compare the values from each json
   */
  public isSubsetWith(subJson: any, superJson: any, compareFn: (f: any, s: any) => boolean);

  /**
   * Check if a json is a subset of another json through strict equivalence
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
  public isSubsetArray(subArray: any[], superArray: any[]): boolean;

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
  public containSameElementsWith(array1: any[], array2: any[], comparer: (f: any, s: any) => boolean);

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
}

export const jsonComparer: JsonComparer;

export const jsonRefactor: JsonRefactor;

export const migrationHandler: MigrationHandler;
