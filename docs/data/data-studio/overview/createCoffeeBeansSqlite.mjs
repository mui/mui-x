import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { getColumnType, getColumnParser, parseValue } from './sqliteSchema.mjs';

const DATASET = 'coffee-beans';

const sourceDir = process.argv[2] ?? path.join(os.homedir(), 'Downloads', 'Coffe Beans Sales_csvs');
const outputFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'coffee-beans.sqlite',
);

const tables = [
  { name: 'customers', file: 'customers.csv' },
  { name: 'products', file: 'products.csv' },
  { name: 'orders', file: 'orders.csv' },
];

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function importTable(db, table) {
  const csvPath = path.join(sourceDir, table.file);
  const csvRows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
  const [headers, ...rows] = csvRows;

  if (!headers?.length) {
    throw new Error(`Missing CSV headers in ${csvPath}`);
  }

  db.exec(`DROP TABLE IF EXISTS ${quoteIdentifier(table.name)}`);
  db.exec(
    `CREATE TABLE ${quoteIdentifier(table.name)} (
      "__rowId" INTEGER PRIMARY KEY AUTOINCREMENT,
      ${headers
        .map((header) => `${quoteIdentifier(header)} ${getColumnType(DATASET, table.name, header)}`)
        .join(',\n')}
    )`,
  );

  const parsers = headers.map((header) => getColumnParser(DATASET, table.name, header));

  const insert = db.prepare(
    `INSERT INTO ${quoteIdentifier(table.name)} (${headers.map(quoteIdentifier).join(', ')})
     VALUES (${headers.map(() => '?').join(', ')})`,
  );
  const insertRows = db.transaction(() => {
    rows.forEach((row) => {
      insert.run(
        headers.map((_, index) => {
          const raw = row[index] ?? '';
          return parsers[index] ? parseValue(parsers[index], raw) : raw;
        }),
      );
    });
  });

  insertRows();
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.rmSync(outputFile, { force: true });

const db = new Database(outputFile);

tables.forEach((table) => importTable(db, table));
db.close();

console.log(`Created ${outputFile}`);
