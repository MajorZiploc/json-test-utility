import { IJsonMigrator } from './IJsonMigrator';

class ListOfJsonMigrator implements IJsonMigrator {
  jsonMigrator: IJsonMigrator;
  constructor(jsonMigrator) {
    this.jsonMigrator = jsonMigrator;
  }
  apply(jsons: any) {
    return jsons.map(this.jsonMigrator.apply);
  }
  description(): string {
    return this.jsonMigrator.description();
  }
}

export function ListOfJsonMigratorOf(eleMigrator: IJsonMigrator): IJsonMigrator {
  return new ListOfJsonMigrator(eleMigrator);
}
