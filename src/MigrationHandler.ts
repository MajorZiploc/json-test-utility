import { IJsonMigrator } from './IJsonMigrator';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as _ from 'lodash';

class MigrationHandler {
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
  migrateJsons(jsons: any[], migrators: IJsonMigrator[]) {
    const migratedJsons = jsons.map(json => migrators.reduce((acc, m) => m.apply(acc), json));
    return migratedJsons;
  }

  /**
   * Create a log file of all alterations to be made to the jsons.
   *
   * @param migrators
   */
  async logMigration(migrators: IJsonMigrator[]) {
    const now = new Date();
    const logFileName = (
      'JsonMigration_' +
      now.getMonth() +
      '-' +
      now.getDay() +
      '-' +
      now.getFullYear() +
      '_h' +
      now.getHours() +
      '_m' +
      now.getMinutes() +
      '_mil' +
      now.getMilliseconds() +
      '.log'
    ).replace(/\s/g, '_');
    await fs.writeFile(logFileName, 'JSON MIGRATION LOG\n\n'); //.catch(err => console.log(err));
    for (var i = 0; i < migrators.length; i++) {
      const migrator = migrators[i];
      const logEntry =
        ' ------------------- ' + 'Migration #' + (i + 1) + ' -------------------\n' + migrator.description() + '\n\n';
      await fs.appendFile(logFileName, logEntry);
    }
  }

  /**
   * 1. Reads a folder and grabs ALL files in that folder and expects them to be jsons.
   * 2. Performs the migration
   * 3. logs the migration if wanted
   *
   * @param folderPath
   * @param migrators
   * @param shouldLog
   */
  async migrateFolder(folderPath: string, migrators: IJsonMigrator[], shouldLog: boolean = false) {
    const jsons = await Promise.all(
      (await fs.readdir(folderPath)).map(async fileName =>
        JSON.parse(await fs.readFile(path.join(folderPath, fileName), 'utf8'))
      )
    );
    const migratedJsons = this.migrateJsons(jsons, migrators); //.map(a => a.map(j => jr.addField(j, 'e', 3)));
    if (shouldLog) {
      this.logMigration(migrators);
    }
    // Write out the migrated jsons
    const filePathAndJson_s = _.zipWith(await fs.readdir(folderPath), migratedJsons, (file, json) => ({
      json,
      filePath: path.join(folderPath, file),
    }));
    await Promise.all(
      filePathAndJson_s.map(
        async filePathAndJson =>
          await fs.writeFile(filePathAndJson.filePath, JSON.stringify(filePathAndJson.json, null, 2), 'utf8')
      )
    );
  }
}

export const migrationHandler = new MigrationHandler();
