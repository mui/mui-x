import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { getColumnType, getColumnParser, parseValue } from './sqliteSchema.mjs';

const DATASET = 'adventure-works';

const sourceDir =
  process.argv[2] ?? path.join(os.homedir(), 'Downloads', 'AdventureWorks Sales_csvs');

const outputFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'adventure-works.sqlite',
);

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

// Turn a CSV-derived identifier into snake_case so the demo simulates a
// realistic customer database (display labels are added on the server side
// from the snake_case fields).
//   - drop a trailing `_data` / ` data` suffix (`Customer_data` → `Customer`)
//   - split CamelCase / PascalCase (`SalesOrderLineKey` → `Sales_Order_Line_Key`)
//   - collapse non-alphanumerics to a single underscore
//   - lowercase
// Applied to both table names (from filenames) and column headers (from CSV
// header rows).
function normalizeName(name) {
  return name
    .replace(/[_ .]data$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

function tableNameFromFile(filename) {
  return normalizeName(path.basename(filename, path.extname(filename)));
}

function importTable(db, tableName, csvPath) {
  const csvRows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
  const [rawHeaders, ...rows] = csvRows;

  if (!rawHeaders?.length) {
    console.warn(`Skipping ${csvPath}: no headers found`);
    return;
  }

  const headers = rawHeaders.map(normalizeName);

  db.exec(`DROP TABLE IF EXISTS ${quoteIdentifier(tableName)}`);
  db.exec(
    `CREATE TABLE ${quoteIdentifier(tableName)} (
      "__rowId" INTEGER PRIMARY KEY AUTOINCREMENT,
      ${headers
        .map((header) => `${quoteIdentifier(header)} ${getColumnType(DATASET, tableName, header)}`)
        .join(',\n')}
    )`,
  );

  const parsers = headers.map((header) => getColumnParser(DATASET, tableName, header));

  const insert = db.prepare(
    `INSERT INTO ${quoteIdentifier(tableName)} (${headers.map(quoteIdentifier).join(', ')})
     VALUES (${headers.map(() => '?').join(', ')})`,
  );
  const insertRows = db.transaction(() => {
    rows.forEach((row) => {
      // Skip empty trailing rows produced by stray newlines in source CSVs.
      if (row.length === 1 && row[0] === '') {
        return;
      }
      insert.run(
        headers.map((_, index) => {
          const raw = row[index] ?? '';
          return parsers[index] ? parseValue(parsers[index], raw) : raw;
        }),
      );
    });
  });

  insertRows();
  console.log(`Imported ${rows.length} rows into ${tableName}`);
}

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  console.error(
    `Pass a path as the first argument, e.g.\n  node ${path.basename(fileURLToPath(import.meta.url))} /path/to/csvs`,
  );
  process.exit(1);
}

const csvFiles = fs
  .readdirSync(sourceDir)
  .filter((entry) => entry.toLowerCase().endsWith('.csv'))
  .sort();

if (csvFiles.length === 0) {
  console.error(`No CSV files found in ${sourceDir}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.rmSync(outputFile, { force: true });

const db = new Database(outputFile);

csvFiles.forEach((file) => {
  const tableName = tableNameFromFile(file);
  importTable(db, tableName, path.join(sourceDir, file));
});

db.close();

console.log(`\nCreated ${outputFile} with ${csvFiles.length} table(s)`);
