import type { RefObject } from '@mui/x-internals/types';
import type { GridColDef, GridRowId, GridValidRowModel } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { computeFullFormulaPass, computeRowsDiffFormulaPass } from './createFormulaEvaluation';
import type { FormulaPassContext } from './createFormulaEvaluation';
import { createFormulaInternalCache, GRID_FORMULA_FUNCTIONS } from './gridFormulaUtils';

/**
 * Evaluation-layer harness: jsdom cannot render 100k rows, so the perf
 * gates run the pass functions directly against a stubbed apiRef.
 * `gridRowIdSelector` only reads `state.props.getRowId`, and raw values
 * resolve from the row objects — nothing else of the grid is touched.
 */
function createStubApiRef(): RefObject<GridPrivateApiPremium> {
  return {
    current: { state: { props: {} }, instanceId: { id: 0 } },
  } as unknown as RefObject<GridPrivateApiPremium>;
}

describe('createFormulaEvaluation - ranges at scale', () => {
  const ROW_COUNT = 100_000;
  const PRICE_SUM = (ROW_COUNT * (ROW_COUNT - 1)) / 2;

  function buildFixture() {
    const rowsLookup: Record<GridRowId, GridValidRowModel> = {};
    const rowIds: GridRowId[] = [];
    for (let i = 0; i < ROW_COUNT; i += 1) {
      rowsLookup[i] =
        i === 0
          ? { id: 0, price: 0, summary: '=SUM(COLUMN_VALUES("price"))' }
          : { id: i, price: i };
      rowIds.push(i);
    }

    const apiRef = createStubApiRef();
    const cache = createFormulaInternalCache(GRID_FORMULA_FUNCTIONS);
    const createContext = (
      contextRows: Record<GridRowId, GridValidRowModel>,
      previousLookup: FormulaPassContext['previousLookup'],
    ): FormulaPassContext => ({
      apiRef,
      cache,
      rowsLookup: contextRows,
      columnsLookup: {
        price: { field: 'price' },
        summary: { field: 'summary', allowFormulas: true } as GridColDef,
      },
      formulaFields: ['summary'],
      previousLookup,
      getPositionSnapshot: () => ({ rowIds, fields: ['price', 'summary'] }),
    });

    return { rowsLookup, createContext };
  }

  it('evaluates SUM(COLUMN_VALUES()) over 100k rows within the perf budget', () => {
    const { rowsLookup, createContext } = buildFixture();

    const start = performance.now();
    const result = computeFullFormulaPass(createContext(rowsLookup, {}));
    const elapsed = performance.now() - start;

    expect(result.lookup['0'].summary).to.deep.equal({ type: 'value', value: PRICE_SUM });
    // Catastrophic-regression bound only — the measured time is an order of
    // magnitude smaller (see docsTech/data-grid-formula-feature.md).
    expect(elapsed).to.be.lessThan(5_000);
  });

  it('recomputes a column sum incrementally on a single-cell change', () => {
    const { rowsLookup, createContext } = buildFixture();
    const full = computeFullFormulaPass(createContext(rowsLookup, {}));

    // Replace one row immutably, like a grid rows update does.
    const nextRows = { ...rowsLookup, 5: { id: 5, price: 5 + PRICE_SUM } };
    const diffCtx = createContext(nextRows, full.lookup);

    const start = performance.now();
    const diff = computeRowsDiffFormulaPass(diffCtx);
    const elapsed = performance.now() - start;

    // Only the dirty subgraph recomputed: the sum cell is the only change.
    expect(diff?.changedCells).to.deep.equal([{ id: 0, field: 'summary' }]);
    expect(diff?.lookup['0'].summary).to.deep.equal({
      type: 'value',
      value: 2 * PRICE_SUM,
    });
    expect(elapsed).to.be.lessThan(2_000);
  });
});
