import { IJsonMigrator } from '../../IJsonMigrator';
import { nameMigrator } from './NameMigrator';

export class ListOfJsonMigrator implements IJsonMigrator {
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
