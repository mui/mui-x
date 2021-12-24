import * as React from 'react';
import { GridRowModel } from '@mui/x-data-grid';

function sleep(time: number): Promise<void> {
  return new Promise<void>((res) => {
    setTimeout(res, time);
  });
}

export type FakeServerReturnType = {
  get: any;
};

export const useFakeServer = (rows: GridRowModel[]): FakeServerReturnType => {
  const get = React.useCallback(
    async ({ page = 0, pageSize = 10, cursor }) => {
      if (cursor !== undefined) {
        const start = cursor ? rows.findIndex((row) => row.id === cursor) : 0;
        const end = start + pageSize;

        await sleep(Math.random() * 200 + 100);
        return { data: rows.slice(start, end), total: rows.length, nextCursor: rows[end]?.id };
      }

      const start = page * pageSize;
      const end = (page + 1) * pageSize;

      await sleep(Math.random() * 200 + 100);
      return { data: rows.slice(start, end), total: rows.length, nextCursor: rows[end]?.id };
    },
    [rows],
  );

  return { get };
};
