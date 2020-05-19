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
