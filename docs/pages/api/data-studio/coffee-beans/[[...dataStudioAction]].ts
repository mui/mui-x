import fs from 'node:fs';
import path from 'node:path';
import {
  createDataStudioDataSourceFromSQLite,
  createDataStudioServer,
  createNextDataStudioHandler,
  DataStudioServerError,
  type DataStudioSourceHooks,
} from '@mui/x-data-studio/server';
// Cache-bust marker (date studio fix): bump to force Next.js dev server recompile.
// 2026-05-31 (phase2 groupByRaw)

const databasePathCandidates = [
  path.join(process.cwd(), 'data/data-studio/overview/coffee-beans.sqlite'),
  path.join(process.cwd(), 'docs/data/data-studio/overview/coffee-beans.sqlite'),
];

const databasePath =
  databasePathCandidates.find((candidate) => fs.existsSync(candidate)) ?? databasePathCandidates[0];

interface CoffeeBeansContext extends Record<string, unknown> {
  role?: 'editor' | 'reader';
  userId?: string;
}

const coffeeBeansHooks: DataStudioSourceHooks<CoffeeBeansContext> = {
  onBefore({ context, operation }) {
    if (context.role !== 'editor') {
      throw new DataStudioServerError(
        `MUI X Data Studio: The demo user cannot run "${operation}" because they are not an editor.
This prevents unauthorized users from mutating the Coffee Beans demo data.
Authenticate the request with a user that has the editor role before mutating rows.`,
        403,
      );
    }
  },
};

const server = createDataStudioServer<CoffeeBeansContext>({
  createContext(request) {
    const roleHeader = request.headers?.['x-data-studio-role'];
    const role =
      (Array.isArray(roleHeader) ? roleHeader[0] : roleHeader) === 'reader' ? 'reader' : 'editor';

    return {
      role,
      userId: 'coffee-beans-demo-user',
    };
  },
  onBeforeRequest({ context }) {
    if (!context.userId) {
      throw new DataStudioServerError(
        `MUI X Data Studio: The Coffee Beans demo request is missing an authenticated user.
This prevents the demo endpoint from serving data without request context.
Create request context with a user id before handling Data Studio requests.`,
        401,
      );
    }
  },
  dataSources: [
    createDataStudioDataSourceFromSQLite({
      id: 'customers',
      table: 'customers',
      filename: databasePath,
      label: 'Customers',
      rowIdField: 'Customer ID',
      hiddenFields: ['__rowId'],
      mutations: true,
      hooks: coffeeBeansHooks,
    }),
    createDataStudioDataSourceFromSQLite({
      id: 'products',
      table: 'products',
      filename: databasePath,
      label: 'Products',
      rowIdField: 'Product ID',
      hiddenFields: ['__rowId'],
      mutations: true,
      hooks: coffeeBeansHooks,
    }),
    createDataStudioDataSourceFromSQLite({
      id: 'orders',
      table: 'orders',
      filename: databasePath,
      label: 'Orders',
      rowIdField: '__rowId',
      hiddenFields: ['__rowId'],
      mutations: true,
      hooks: coffeeBeansHooks,
    }),
  ],
});

export default createNextDataStudioHandler(server);
