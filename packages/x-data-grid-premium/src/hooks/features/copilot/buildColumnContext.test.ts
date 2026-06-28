import { describe, expect, it } from 'vitest';
import type { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid-pro';
import { buildCopilotColumnContext } from './buildColumnContext';

function makeColumn(overrides: Partial<GridColDef> = {}): GridColDef {
  return {
    field: 'status',
    headerName: 'Status',
    type: 'string',
    filterOperators: [
      { value: 'is', getApplyFilterFn: () => null },
      { value: 'not', getApplyFilterFn: () => null },
    ],
    ...overrides,
  } as GridColDef;
}

describe('buildCopilotColumnContext', () => {
  it('forwards string-array valueOptions for singleSelect', () => {
    const col: GridSingleSelectColDef = {
      ...makeColumn({ type: 'singleSelect' }),
      type: 'singleSelect',
      valueOptions: ['Open', 'Partially Filled', 'Filled', 'Rejected'],
    } as GridSingleSelectColDef;
    const ctx = buildCopilotColumnContext(col as GridColDef);
    expect(ctx.type).to.equal('singleSelect');
    expect(ctx.valueOptions).to.deep.equal(['Open', 'Partially Filled', 'Filled', 'Rejected']);
  });

  it('preserves {value,label} object valueOptions verbatim', () => {
    const col: GridSingleSelectColDef = {
      ...makeColumn({ type: 'singleSelect' }),
      type: 'singleSelect',
      valueOptions: [
        { value: 'PartiallyFilled', label: 'Partially Filled' },
        { value: 'Filled', label: 'Filled' },
      ],
    } as GridSingleSelectColDef;
    const ctx = buildCopilotColumnContext(col as GridColDef);
    expect(ctx.valueOptions).to.deep.equal([
      { value: 'PartiallyFilled', label: 'Partially Filled' },
      { value: 'Filled', label: 'Filled' },
    ]);
  });

  it('resolves function-valued valueOptions at call time', () => {
    const col: GridSingleSelectColDef = {
      ...makeColumn({ type: 'singleSelect' }),
      type: 'singleSelect',
      valueOptions: () => ['A', 'B', 'C'],
    } as GridSingleSelectColDef;
    const ctx = buildCopilotColumnContext(col as GridColDef);
    expect(ctx.valueOptions).to.deep.equal(['A', 'B', 'C']);
  });

  it('omits valueOptions for non-enum columns', () => {
    const col = makeColumn({ type: 'string' });
    const ctx = buildCopilotColumnContext(col);
    expect(ctx.valueOptions).to.equal(undefined);
  });

  it('omits valueOptions when the array is empty', () => {
    const col: GridSingleSelectColDef = {
      ...makeColumn({ type: 'singleSelect' }),
      type: 'singleSelect',
      valueOptions: [],
    } as GridSingleSelectColDef;
    const ctx = buildCopilotColumnContext(col as GridColDef);
    expect(ctx.valueOptions).to.equal(undefined);
  });

  it('maps filterOperators to allowedOperators', () => {
    const col = makeColumn({
      filterOperators: [
        { value: 'contains', getApplyFilterFn: () => null },
        { value: 'equals', getApplyFilterFn: () => null },
      ],
    });
    const ctx = buildCopilotColumnContext(col);
    expect(ctx.allowedOperators).to.deep.equal(['contains', 'equals']);
  });

  it("defaults `type` to 'string' and `description` to null when missing", () => {
    const col = { field: 'foo', filterOperators: [] } as unknown as GridColDef;
    const ctx = buildCopilotColumnContext(col);
    expect(ctx.type).to.equal('string');
    expect(ctx.description).to.equal(null);
  });
});
