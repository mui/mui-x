import fs from 'node:fs';
import path from 'node:path';
// @ts-expect-error - better-sqlite3 doesn't ship types; the structural shim
// below covers the two methods used for schema discovery.
import Database from 'better-sqlite3';
import {
  createDataStudioDataSourceFromSQLite,
  createDataStudioServer,
  createNextDataStudioHandler,
  DataStudioServerError,
  sqlAffinityToGridType,
  type DataStudioSourceHooks,
} from '@mui/x-data-studio/server';
import type { GridColDef } from '@mui/x-data-grid-premium';

interface SqliteColumnInfo {
  name: string;
  type?: string;
}

interface SqliteDb {
  prepare(sql: string): { all(): Array<{ name: string; type?: string }> };
  close(): void;
}
type SqliteCtor = new (filename: string, options?: { readonly?: boolean }) => SqliteDb;
const TypedDatabase = Database as unknown as SqliteCtor;

const databasePathCandidates = [
  path.join(process.cwd(), 'data/data-studio/overview/adventure-works.sqlite'),
  path.join(process.cwd(), 'docs/data/data-studio/overview/adventure-works.sqlite'),
];

const databasePath =
  databasePathCandidates.find((candidate) => fs.existsSync(candidate)) ?? databasePathCandidates[0];

interface AdventureWorksContext extends Record<string, unknown> {
  role?: 'editor' | 'reader';
  userId?: string;
}

const adventureWorksHooks: DataStudioSourceHooks<AdventureWorksContext> = {
  onBefore({ context, operation }) {
    if (context.role !== 'editor') {
      throw new DataStudioServerError(
        `MUI X Data Studio: The demo user cannot run "${operation}" because they are not an editor.
This prevents unauthorized users from mutating the Adventure Works demo data.
Authenticate the request with a user that has the editor role before mutating rows.`,
        403,
      );
    }
  },
};

// Snake-case tokens that should be uppercased when humanized (e.g. `customer_id`
// → `Customer ID`, not `Customer Id`).
const ACRONYMS = new Set(['id', 'sku', 'url', 'api', 'csv', 'usd', 'eur', 'gbp']);

function humanize(field: string): string {
  return field
    .split('_')
    .map((word) => {
      if (!word) {
        return word;
      }
      if (ACRONYMS.has(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

interface DiscoveredTable {
  name: string;
  columns: SqliteColumnInfo[];
}

// Enumerate user tables + their columns from `sqlite_master` / PRAGMA at
// module load. The generator writes snake_case everywhere; this layer is
// responsible for projecting back to friendly `headerName`s so the demo
// looks like a real customer that stores `reseller_key` but renders
// "Reseller Key" in the data grid.
function discoverTables(filename: string): DiscoveredTable[] {
  if (!fs.existsSync(filename)) {
    return [];
  }
  const db = new TypedDatabase(filename, { readonly: true });
  try {
    const rows = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
      .all();
    return rows
      .map((row) => {
        const columns = db.prepare(`PRAGMA table_info("${row.name}")`).all();
        return {
          name: row.name,
          columns: columns
            .filter((c) => c.name !== '__rowId')
            .map((c) => ({ name: c.name, type: c.type })),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    db.close();
  }
}

function buildColumnsForTable(columns: SqliteColumnInfo[]): GridColDef[] {
  return columns.map((col) => {
    const headerName = humanize(col.name);
    const type = sqlAffinityToGridType(col.type);
    const column: GridColDef = {
      field: col.name,
      headerName,
      minWidth: Math.max(120, headerName.length * 10),
    };
    if (type) {
      column.type = type;
    }
    return column;
  });
}

const tables = discoverTables(databasePath);

const server = createDataStudioServer<AdventureWorksContext>({
  createContext(request) {
    const roleHeader = request.headers?.['x-data-studio-role'];
    const role =
      (Array.isArray(roleHeader) ? roleHeader[0] : roleHeader) === 'reader' ? 'reader' : 'editor';

    return {
      role,
      userId: 'adventure-works-demo-user',
    };
  },
  onBeforeRequest({ context }) {
    if (!context.userId) {
      throw new DataStudioServerError(
        `MUI X Data Studio: The Adventure Works demo request is missing an authenticated user.
This prevents the demo endpoint from serving data without request context.
Create request context with a user id before handling Data Studio requests.`,
        401,
      );
    }
  },
  dataSources: tables.map(({ name, columns }) =>
    createDataStudioDataSourceFromSQLite({
      id: name,
      table: name,
      filename: databasePath,
      label: humanize(name),
      rowIdField: '__rowId',
      hiddenFields: ['__rowId'],
      columns: buildColumnsForTable(columns),
      mutations: true,
      hooks: adventureWorksHooks,
      // All tables live in one SQLite file, so any of them can be joined together
      // in the UI's joint-source builder.
      joinGroup: 'adventure-works',
    }),
  ),
});

export default createNextDataStudioHandler(server);
