import { describe, expect, it } from 'vitest';
import { buildPdfReportState, type PdfReportQueryResultLike } from './buildState';

type TestQueryResult = PdfReportQueryResultLike & {
  meta: { mode: string; rowFilter: string; rowCount: number; truncatedBy: number; columns: any[] };
  rows?: any[];
  aggregations?: any[];
};

function makeQueryResult(overrides: Partial<TestQueryResult> = {}): TestQueryResult {
  return {
    meta: {
      mode: 'aggregate',
      rowFilter: 'visible',
      rowCount: 142,
      truncatedBy: 0,
      columns: [
        { field: 'quantity', headerName: 'Quantity' },
        { field: 'filledQuantity', headerName: 'Filled' },
      ],
    },
    aggregations: [
      { field: 'quantity', fn: 'sum', value: 4_667_855 },
      { field: 'filledQuantity', fn: 'sum', value: 2_891_022 },
    ],
    rows: undefined,
    ...overrides,
  };
}

const FAKE_API: any = {
  getRowsCount: () => 5000,
  getVisibleRows: () => ({ rows: new Array(142) }),
  getAllColumns: () => [
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'filledQuantity', headerName: 'Filled' },
  ],
};

describe('buildPdfReportState', () => {
  it('exposes /queries/<toolCallId>/aggregations/N/value paths', () => {
    const map = new Map<string, TestQueryResult>([['qg_001', makeQueryResult()]]);
    const state = buildPdfReportState({ queryResults: map, gridApi: FAKE_API });
    expect((state.queries as any).qg_001.aggregations[0].value).to.equal(4_667_855);
    expect((state.queries as any).qg_001.meta.rowCount).to.equal(142);
    expect((state.queries as any).qg_001.meta.columnCount).to.equal(2);
  });

  it('exposes grid summary at /grid', () => {
    const state = buildPdfReportState({ queryResults: new Map(), gridApi: FAKE_API });
    const grid = state.grid as { rowCount: number; visibleRowCount: number; columns: any[] };
    expect(grid.rowCount).to.equal(5000);
    expect(grid.visibleRowCount).to.equal(142);
    expect(grid.columns).to.have.lengthOf(2);
    expect(grid.columns[0]).to.deep.equal({ field: 'quantity', headerName: 'Quantity' });
  });

  it('exposes /generatedAt as an ISO timestamp', () => {
    const state = buildPdfReportState({ queryResults: new Map() });
    expect(state.generatedAt).to.be.a('string');
    expect(() => new Date(state.generatedAt as string)).not.to.throw();
  });

  it('tolerates an absent gridApi', () => {
    const state = buildPdfReportState({ queryResults: new Map() });
    expect(state.grid).to.deep.equal({ rowCount: 0, visibleRowCount: 0, columns: [] });
  });

  it('keeps row-mode rows for repeat lookups', () => {
    const map = new Map<string, TestQueryResult>([
      [
        'qg_002',
        makeQueryResult({
          meta: {
            mode: 'rows',
            rowFilter: 'visible',
            rowCount: 3,
            truncatedBy: 0,
            columns: [{ field: 'country' }, { field: 'revenue' }],
          },
          rows: [
            { country: 'US', revenue: 1200 },
            { country: 'DE', revenue: 800 },
            { country: 'FR', revenue: 650 },
          ],
          aggregations: undefined,
        }),
      ],
    ]);
    const state = buildPdfReportState({ queryResults: map });
    const rows = (state.queries as any).qg_002.rows as Array<Record<string, unknown>>;
    expect(rows).to.have.lengthOf(3);
    expect(rows[0]).to.deep.equal({ country: 'US', revenue: 1200 });
  });
});
