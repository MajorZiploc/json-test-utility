import { IJsonMigrator } from '../../IJsonMigrator';
import { jsonRefactor as jr } from './../../JsonRefactor';

class NameMigrator implements IJsonMigrator {
  apply(json: any) {
    const subJson = jr.subJson(json, ['status', 'date']);
    return jr.addField(
      subJson,
      'name',
      (json.prefix.length == 0 ? '' : json.prefix + ' ') + json.firstName + ' ' + json.lastName
    );
  }
  description(): string {
    return 'places all name fields into one field';
  }
}

export const nameMigrator = new NameMigrator();
