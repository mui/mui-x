// One-shot migration that rewrites the "golden" Data Studio demo SQLite
// fixtures with correct column affinities. The original files (committed in
// version control) declare every column as TEXT and store pre-formatted values
// like " $1,431.50 " / "0.00%"; this script parses them and re-creates each
// affected table with REAL / INTEGER affinity so the grid receives real
// numbers, not strings.
//
//   node docs/data/data-studio/overview/migrateSqliteTypes.mjs
//
// Idempotent: running it twice is a no-op (already-typed columns stay typed,
// already-parsed values stay numeric).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { SCHEMA, parseValue } from './sqliteSchema.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

const dataSources = [
  { name: 'coffee-beans', filename: 'coffee-beans.sqlite' },
  { name: 'adventure-works', filename: 'adventure-works.sqlite' },
];

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function getColumnsForTable(db, table) {
  return db
    .prepare(`PRAGMA table_info(${quoteIdentifier(table)})`)
    .all()
    .map((row) => ({ name: row.name, type: String(row.type ?? '').toUpperCase() }));
}

function tableExists(db, table) {
  const row = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
    .get(table);
  return Boolean(row);
}

function migrateTable(db, dataSourceName, tableName, columnSpec) {
  if (!tableExists(db, tableName)) {
    console.warn(`  [skip] table "${tableName}" not present`);
    return;
  }

  const existingColumns = getColumnsForTable(db, tableName);
  const existingByName = new Map(existingColumns.map((col) => [col.name, col]));

  // Pre-flight: every column listed in the schema must exist in the DB.
  for (const field of Object.keys(columnSpec)) {
    if (!existingByName.has(field)) {
      throw new Error(`Column "${field}" not found in table "${tableName}"`);
    }
  }

  // Compute the target affinity for every column and check whether any column
  // actually needs to change. Columns not listed in the spec keep whatever
  // affinity they already have.
  let needsRewrite = false;
  const targetColumns = existingColumns.map((col) => {
    const desired = columnSpec[col.name]?.type ?? col.type ?? 'TEXT';
    if (desired.toUpperCase() !== col.type.toUpperCase()) {
      needsRewrite = true;
    }
    return { ...col, targetType: desired };
  });

  if (!needsRewrite) {
    console.log(`  [ok]   ${tableName}: already typed`);
    return;
  }

  // Rebuild the table: read rows -> create __new with correct types -> insert
  // parsed values -> drop original -> rename. Wrapped in a transaction so the
  // file is left untouched on error.
  const tmpName = `${tableName}__new`;

  const columnsDdl = targetColumns
    .map((col) => {
      if (col.name === '__rowId') {
        return `${quoteIdentifier(col.name)} INTEGER PRIMARY KEY`;
      }
      return `${quoteIdentifier(col.name)} ${col.targetType}`;
    })
    .join(',\n      ');

  const fieldList = targetColumns.map((col) => quoteIdentifier(col.name)).join(', ');
  const placeholders = targetColumns.map(() => '?').join(', ');

  const selectRows = db.prepare(`SELECT * FROM ${quoteIdentifier(tableName)}`).all();
  console.log(`  [migrate] ${tableName}: ${selectRows.length} rows`);

  const rewrite = db.transaction(() => {
    db.exec(`DROP TABLE IF EXISTS ${quoteIdentifier(tmpName)}`);
    db.exec(`CREATE TABLE ${quoteIdentifier(tmpName)} (
      ${columnsDdl}
    )`);

    const insert = db.prepare(
      `INSERT INTO ${quoteIdentifier(tmpName)} (${fieldList}) VALUES (${placeholders})`,
    );

    for (const row of selectRows) {
      const values = targetColumns.map((col) => {
        const raw = row[col.name];
        const parser = columnSpec[col.name]?.parser;
        if (!parser) {
          return raw;
        }
        return parseValue(parser, raw);
      });
      insert.run(values);
    }

    db.exec(`DROP TABLE ${quoteIdentifier(tableName)}`);
    db.exec(`ALTER TABLE ${quoteIdentifier(tmpName)} RENAME TO ${quoteIdentifier(tableName)}`);
  });

  rewrite();
}

function migrateDataset({ name, filename }) {
  const file = path.join(here, filename);
  if (!fs.existsSync(file)) {
    console.warn(`[skip] ${name}: ${file} not found`);
    return;
  }
  console.log(`\n${name} (${filename})`);

  const dataSource = SCHEMA[name];
  if (!dataSource) {
    console.warn(`[skip] ${name}: no schema entry`);
    return;
  }

  const db = new Database(file);
  try {
    db.pragma('foreign_keys = OFF');
    for (const [tableName, columnSpec] of Object.entries(dataSource)) {
      migrateTable(db, name, tableName, columnSpec);
    }
    db.exec('VACUUM');
  } finally {
    db.close();
  }
}

dataSources.forEach(migrateDataset);

console.log('\nDone.');
