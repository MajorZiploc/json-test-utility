import { IJsonMigrator } from '../../IJsonMigrator';
import { jr } from './../../JsonRefactor';

class DateMigrator implements IJsonMigrator {
  apply(json: any) {
    return jr.setField(json, 'date', json.date.replace(/\//g, '-'));
  }
  description(): string {
    return 'Converts / to - for the date field';
  }
}

export const dateMigrator = new DateMigrator();
