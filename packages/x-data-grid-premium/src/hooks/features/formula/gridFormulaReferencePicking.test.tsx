import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { act, createRenderer } from '@mui/internal-test-utils';
import { microtasks } from 'test/utils/helperFn';
import { describe, expect, it } from 'vitest';
import {
  DataGridPremium,
  GRID_CHECKBOX_SELECTION_FIELD,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi, GridRowId } from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { parseFormula, toCanonicalFormula } from './engine';
import { createTestPositionContext } from './engine/testUtils';
import {
  buildPickedReferenceText,
  createFormulaPickTarget,
  getPickedReferenceText,
} from './gridFormulaReferencePicking';
import type { FormulaPickTarget } from './gridFormulaReferencePicking';

const cell = (rowId: GridRowId, field: string): FormulaPickTarget => ({
  kind: 'cell',
  rowId,
  field,
});

/**
 * The range between two cells, as a picking gesture describes it: `[rowId, field]` corners.
 */
const range = (start: [GridRowId, string], end: [GridRowId, string]): FormulaPickTarget => ({
  kind: 'range',
  startRowId: start[0],
  startField: start[1],
  endRowId: end[0],
  endField: end[1],
});

describe('buildPickedReferenceText', () => {
  // fields: A=item, B=price, C=quantity, D=total · rows: 1..3 = ids 1..3
  const context = createTestPositionContext([1, 2, 3], ['item', 'price', 'quantity', 'total']);
  const owner = { id: 1, field: 'total' };

  describe('same-row target (D4)', () => {
    it('writes the field name in both dialects', () => {
      expect(buildPickedReferenceText(context, owner, cell(1, 'price'))).toEqual('price');
      expect(
        buildPickedReferenceText(context, owner, cell(1, 'price'), { a1Notation: true }),
      ).toEqual('price');
    });

    it('matches the owner row under string coercion', () => {
      expect(buildPickedReferenceText(context, owner, cell('1', 'price'))).toEqual('price');
    });

    it('escapes a field name that is not a bare identifier', () => {
      const spaced = createTestPositionContext([1, 2], ['unit price', 'total']);
      expect(buildPickedReferenceText(spaced, owner, cell(1, 'unit price'))).toEqual(
        'FIELD("unit price")',
      );
    });

    it('escapes a field named like an A1 address, in A1 notation only', () => {
      const ambiguous = createTestPositionContext([1, 2], ['q1', 'total']);
      expect(
        buildPickedReferenceText(ambiguous, owner, cell(1, 'q1'), { a1Notation: true }),
      ).toEqual('FIELD("q1")');
      expect(buildPickedReferenceText(ambiguous, owner, cell(1, 'q1'))).toEqual('q1');
    });

    it('escapes a field named like a reserved name', () => {
      const reserved = createTestPositionContext([1, 2], ['ref', 'total']);
      expect(buildPickedReferenceText(reserved, owner, cell(1, 'ref'))).toEqual('FIELD("ref")');
    });

    it('reads back as a same-row reference', () => {
      const ambiguous = createTestPositionContext([1, 2], ['q1', 'unit price', 'total']);
      for (const field of ['q1', 'unit price']) {
        for (const a1Notation of [true, false]) {
          const text = buildPickedReferenceText(ambiguous, owner, cell(1, field), { a1Notation })!;
          const canonical = a1Notation
            ? toCanonicalFormula(text, { positionContext: ambiguous, anchorCell: owner }).source
            : text;
          expect(parseFormula(canonical).ast).toMatchObject({ type: 'fieldRef', field });
        }
      }
    });
  });

  describe('cross-row target', () => {
    it('writes the A1 address in A1 notation', () => {
      expect(
        buildPickedReferenceText(context, owner, cell(2, 'price'), { a1Notation: true }),
      ).toEqual('B2');
      expect(
        buildPickedReferenceText(context, owner, cell(3, 'item'), { a1Notation: true }),
      ).toEqual('A3');
    });

    it('writes a canonical REF otherwise', () => {
      expect(buildPickedReferenceText(context, owner, cell(2, 'price'))).toEqual(
        'REF(COLUMN("price"), ROW(2))',
      );
    });

    it('keeps a number id a number whatever type the caller passes', () => {
      expect(buildPickedReferenceText(context, owner, cell('2', 'price'))).toEqual(
        'REF(COLUMN("price"), ROW(2))',
      );
    });

    it('quotes a string id', () => {
      const stringIds = createTestPositionContext(['order-1', 'order "2"'], ['price', 'total']);
      const stringOwner = { id: 'order-1', field: 'total' };
      expect(buildPickedReferenceText(stringIds, stringOwner, cell('order "2"', 'price'))).toEqual(
        'REF(COLUMN("price"), ROW("order ""2"""))',
      );
    });

    it('uses the view position of the row, not its id', () => {
      const sorted = createTestPositionContext([30, 10, 20], ['item', 'price']);
      expect(
        buildPickedReferenceText(sorted, { id: 30, field: 'price' }, cell(20, 'item'), {
          a1Notation: true,
        }),
      ).toEqual('A3');
    });

    it('uses letters past Z', () => {
      const fields = Array.from({ length: 28 }, (_, index) => `f${index}`);
      const wide = createTestPositionContext([1, 2], fields);
      expect(
        buildPickedReferenceText(wide, { id: 1, field: 'f0' }, cell(2, 'f27'), {
          a1Notation: true,
        }),
      ).toEqual('AB2');
    });

    it('is relative: no `$` and no positional selector', () => {
      const a1 = buildPickedReferenceText(context, owner, cell(2, 'price'), { a1Notation: true })!;
      const canonical = buildPickedReferenceText(context, owner, cell(2, 'price'))!;
      expect(a1).not.toContain('$');
      expect(canonical).not.toContain('POSITION');
    });

    it('reads back to the picked cell (A1 → canonical → AST)', () => {
      const text = buildPickedReferenceText(context, owner, cell(2, 'price'), {
        a1Notation: true,
      })!;
      const { source } = toCanonicalFormula(text, { positionContext: context, anchorCell: owner });
      expect(source).toEqual('REF(COLUMN("price"), ROW(2))');
    });

    it('reads back to the picked cell (canonical → AST)', () => {
      const stringIds = createTestPositionContext(['a', 'b'], ['unit price', 'total']);
      const text = buildPickedReferenceText(
        stringIds,
        { id: 'a', field: 'total' },
        cell('b', 'unit price'),
      )!;
      expect(parseFormula(text).ast).toMatchObject({
        type: 'cellRef',
        column: { kind: 'field', field: 'unit price' },
        row: { kind: 'id', id: 'b' },
      });
    });

    it('writes a cell reference for a same-column cell of another row', () => {
      expect(
        buildPickedReferenceText(context, owner, cell(2, 'total'), { a1Notation: true }),
      ).toEqual('D2');
    });
  });

  describe('non-pickable targets', () => {
    it.each([true, false])('returns null for the owner cell (a1Notation: %s)', (a1Notation) => {
      expect(buildPickedReferenceText(context, owner, cell(1, 'total'), { a1Notation })).toEqual(
        null,
      );
    });

    it.each([true, false])(
      'returns null for a column without a position (a1Notation: %s)',
      (a1Notation) => {
        expect(
          buildPickedReferenceText(context, owner, cell(2, '__check__'), { a1Notation }),
        ).toEqual(null);
        // Same row too: a utility column has no field reference either.
        expect(
          buildPickedReferenceText(context, owner, cell(1, '__check__'), { a1Notation }),
        ).toEqual(null);
      },
    );

    it.each([true, false])(
      'returns null for a row without a position (a1Notation: %s)',
      (a1Notation) => {
        expect(buildPickedReferenceText(context, owner, cell(99, 'price'), { a1Notation })).toEqual(
          null,
        );
      },
    );

    it.each([true, false])('returns null for a pinned row (a1Notation: %s)', (a1Notation) => {
      // rows: 1 = top-pinned, 2..3 = data band, 4 = bottom-pinned
      const pinned = createTestPositionContext(
        ['top', 1, 2, 'bottom'],
        ['item', 'price', 'total'],
        0,
        { dataFromIndex: 2, dataToIndex: 3 },
      );
      expect(buildPickedReferenceText(pinned, owner, cell('top', 'price'), { a1Notation })).toEqual(
        null,
      );
      expect(
        buildPickedReferenceText(pinned, owner, cell('bottom', 'price'), { a1Notation }),
      ).toEqual(null);
      // The band itself stays pickable, numbered after the top-pinned row.
      expect(buildPickedReferenceText(pinned, owner, cell(2, 'price'), { a1Notation })).toEqual(
        a1Notation ? 'B3' : 'REF(COLUMN("price"), ROW(2))',
      );
    });

    it('lets a formula in a pinned row pick a data cell', () => {
      const pinned = createTestPositionContext(['top', 1, 2], ['item', 'price', 'total'], 0, {
        dataFromIndex: 2,
        dataToIndex: 3,
      });
      expect(
        buildPickedReferenceText(pinned, { id: 'top', field: 'total' }, cell(1, 'price'), {
          a1Notation: true,
        }),
      ).toEqual('B2');
    });
  });
});

describe('buildPickedReferenceText (ranges)', () => {
  // fields: A=item, B=price, C=quantity, D=total · rows: 1..4 = ids 1..4
  const fields = ['item', 'price', 'quantity', 'total'];
  const context = createTestPositionContext([1, 2, 3, 4], fields);
  const owner = { id: 1, field: 'total' };

  it('writes the A1 range in A1 notation', () => {
    expect(
      buildPickedReferenceText(context, owner, range([2, 'price'], [4, 'quantity']), {
        a1Notation: true,
      }),
    ).toEqual('B2:C4');
  });

  it('writes a canonical RANGE_REF relative to the cell of the formula otherwise', () => {
    // D1 → B2 is 2 columns to the left and 1 row down; D1 → C4 is 1 column to the left and 3 rows down.
    expect(buildPickedReferenceText(context, owner, range([2, 'price'], [4, 'quantity']))).toEqual(
      'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(3)))',
    );
  });

  it.each([
    ['up and to the left', range([4, 'quantity'], [2, 'price'])],
    ['up and to the right', range([4, 'price'], [2, 'quantity'])],
    ['down and to the left', range([2, 'quantity'], [4, 'price'])],
  ])('goes from the top-left cell to the bottom-right cell: %s', (_, target) => {
    expect(buildPickedReferenceText(context, owner, target, { a1Notation: true })).toEqual('B2:C4');
    expect(buildPickedReferenceText(context, owner, target)).toEqual(
      buildPickedReferenceText(context, owner, range([2, 'price'], [4, 'quantity'])),
    );
  });

  it('writes the same range in both dialects', () => {
    for (const target of [
      range([2, 'price'], [4, 'quantity']),
      range([1, 'item'], [1, 'quantity']),
      range([3, 'total'], [4, 'total']),
      range([1, 'price'], [2, 'total']),
    ]) {
      const a1 = buildPickedReferenceText(context, owner, target, { a1Notation: true })!;
      const canonical = buildPickedReferenceText(context, owner, target)!;
      expect(
        toCanonicalFormula(a1, { positionContext: context, anchorCell: owner }).source,
      ).toEqual(canonical);
      expect(parseFormula(canonical).ast).toMatchObject({ type: 'rangeRef' });
    }
  });

  it('writes cells of the row of the formula as a range, not as field names', () => {
    expect(
      buildPickedReferenceText(context, owner, range([1, 'price'], [1, 'quantity']), {
        a1Notation: true,
      }),
    ).toEqual('B1:C1');
    expect(buildPickedReferenceText(context, owner, range([1, 'price'], [1, 'quantity']))).toEqual(
      'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0)))',
    );
  });

  it('writes a range that covers the cell of the formula as is', () => {
    expect(
      buildPickedReferenceText(context, owner, range([1, 'price'], [2, 'total']), {
        a1Notation: true,
      }),
    ).toEqual('B1:D2');
  });

  it('writes a range of one cell as that cell', () => {
    const single = range([2, 'price'], [2, 'price']);
    expect(buildPickedReferenceText(context, owner, single, { a1Notation: true })).toEqual('B2');
    expect(buildPickedReferenceText(context, owner, single)).toEqual(
      'REF(COLUMN("price"), ROW(2))',
    );
    expect(buildPickedReferenceText(context, owner, range([1, 'price'], [1, 'price']))).toEqual(
      'price',
    );
    expect(buildPickedReferenceText(context, owner, range([1, 'total'], [1, 'total']))).toEqual(
      null,
    );
  });

  it('uses the view positions of the rows, not their ids', () => {
    const sorted = createTestPositionContext([30, 10, 20], ['item', 'price']);
    expect(
      buildPickedReferenceText(
        sorted,
        { id: 30, field: 'price' },
        range([20, 'item'], [10, 'price']),
        { a1Notation: true },
      ),
    ).toEqual('A2:B3');
  });

  it('writes plain positions when the formula is in a pinned row', () => {
    // Row 99 is pinned at the bottom: outside the data band, so nothing is relative to it.
    const pinned = createTestPositionContext([1, 2, 3, 99], fields, 0, {
      dataFromIndex: 1,
      dataToIndex: 3,
    });
    const pinnedOwner = { id: 99, field: 'total' };
    const target = range([2, 'price'], [3, 'quantity']);
    const canonical = buildPickedReferenceText(pinned, pinnedOwner, target);
    expect(canonical).toEqual('RANGE_REF(COLUMN_FROM(2), ROW_FROM(2), COLUMN_TO(3), ROW_TO(3))');
    expect(
      toCanonicalFormula(
        buildPickedReferenceText(pinned, pinnedOwner, target, { a1Notation: true })!,
        { positionContext: pinned, anchorCell: pinnedOwner },
      ).source,
    ).toEqual(canonical);
  });

  it('is relative: no `$` and no fixed axis', () => {
    const target = range([2, 'price'], [4, 'quantity']);
    expect(buildPickedReferenceText(context, owner, target, { a1Notation: true })).not.toContain(
      '$',
    );
    expect(buildPickedReferenceText(context, owner, target)).not.toContain('FIXED');
  });

  it('returns null when a corner cannot be referenced', () => {
    const pinned = createTestPositionContext([1, 2, 3, 99], fields, 0, {
      dataFromIndex: 1,
      dataToIndex: 3,
    });
    // A pinned row, a column without a position, a row that is not in the view.
    expect(buildPickedReferenceText(pinned, owner, range([2, 'price'], [99, 'price']))).toEqual(
      null,
    );
    expect(
      buildPickedReferenceText(
        context,
        owner,
        range([2, 'price'], [3, GRID_CHECKBOX_SELECTION_FIELD]),
      ),
    ).toEqual(null);
    expect(buildPickedReferenceText(context, owner, range([2, 'price'], [42, 'price']))).toEqual(
      null,
    );
  });
});

describe('createFormulaPickTarget', () => {
  const context = createTestPositionContext(
    [1, 2, 3, 99],
    ['item', 'price', 'quantity', 'total'],
    0,
    { dataFromIndex: 1, dataToIndex: 3 },
  );

  it('is the cell when the gesture starts and ends on the same cell', () => {
    expect(
      createFormulaPickTarget(context, { rowId: 2, field: 'price' }, { rowId: 2, field: 'price' }),
    ).toEqual(cell(2, 'price'));
  });

  it('is the range between the two cells, from its top-left to its bottom-right cell', () => {
    const expected = range([2, 'price'], [3, 'quantity']);
    expect(
      createFormulaPickTarget(
        context,
        { rowId: 2, field: 'price' },
        { rowId: 3, field: 'quantity' },
      ),
    ).toEqual(expected);
    expect(
      createFormulaPickTarget(
        context,
        { rowId: 3, field: 'quantity' },
        { rowId: 2, field: 'price' },
      ),
    ).toEqual(expected);
    expect(
      createFormulaPickTarget(
        context,
        { rowId: 3, field: 'price' },
        { rowId: 2, field: 'quantity' },
      ),
    ).toEqual(expected);
  });

  it('is null when one of the cells cannot be part of a reference', () => {
    expect(
      createFormulaPickTarget(context, { rowId: 2, field: 'price' }, { rowId: 99, field: 'price' }),
    ).toEqual(null);
    expect(
      createFormulaPickTarget(
        context,
        { rowId: 2, field: GRID_CHECKBOX_SELECTION_FIELD },
        { rowId: 3, field: 'price' },
      ),
    ).toEqual(null);
  });
});

describe('getPickedReferenceText', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const baselineProps: DataGridPremiumProps = {
    featureDependencies: { formula: formulaFeature },
    autoHeight: true,
    checkboxSelection: true,
    rows: [
      { id: 10, item: 'Apple', price: 2, quantity: 3, q1: 4, total: '=price * quantity' },
      { id: 11, item: 'Banana', price: 1, quantity: 5, q1: 6, total: '=price * quantity' },
      { id: 12, item: 'Cherry', price: 7, quantity: 2, q1: 8, total: '=price * quantity' },
    ],
    pinnedRows: {
      top: [{ id: 'summary', item: 'Summary', price: 0, quantity: 0, q1: 0, total: 0 }],
    },
    columns: [
      { field: 'item' },
      { field: 'price', type: 'number', editable: true },
      { field: 'quantity', type: 'number' },
      { field: 'q1', type: 'number' },
      { field: 'hidden', type: 'number' },
      { field: 'total', type: 'number', allowFormulas: true, editable: true },
      { field: 'actions', type: 'actions', getActions: () => [] },
    ],
    initialState: { columns: { columnVisibilityModel: { hidden: false } } },
  };

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 800, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  const privateApiRef = (): RefObject<GridPrivateApiPremium> => ({
    current: unwrapPrivateAPI(apiRef.current!) as GridPrivateApiPremium,
  });

  // Positions: A=item, B=price, C=quantity, D=q1, E=total, F=actions;
  // rows: 1 = pinned `summary`, 2 = id 10, 3 = id 11, 4 = id 12.
  const owner = { id: 10, field: 'total' };

  it('writes the field name for a cell of the formula row', async () => {
    render(<Test formulaA1Notation />);
    await microtasks();
    expect(
      getPickedReferenceText(privateApiRef(), owner, cell(10, 'price'), { a1Notation: true }),
    ).toEqual('price');
    expect(
      getPickedReferenceText(privateApiRef(), owner, cell(10, 'q1'), { a1Notation: true }),
    ).toEqual('FIELD("q1")');
  });

  it('writes an A1 address from the live positions', async () => {
    render(<Test formulaA1Notation />);
    await microtasks();
    // The checkbox column takes no letter; the pinned row takes row number 1.
    expect(
      getPickedReferenceText(privateApiRef(), owner, cell(11, 'price'), { a1Notation: true }),
    ).toEqual('B3');
    expect(
      getPickedReferenceText(privateApiRef(), owner, cell(12, 'q1'), { a1Notation: true }),
    ).toEqual('D4');
  });

  it('follows the sorted order in A1 notation', async () => {
    render(
      <Test
        formulaA1Notation
        initialState={{
          ...baselineProps.initialState,
          sorting: { sortModel: [{ field: 'price', sort: 'asc' }] },
        }}
      />,
    );
    await microtasks();
    // price asc: 11 (1), 10 (2), 12 (7) → rows 2, 3, 4.
    expect(
      getPickedReferenceText(privateApiRef(), owner, cell(11, 'price'), { a1Notation: true }),
    ).toEqual('B2');
  });

  it('writes a canonical REF when A1 notation is off', async () => {
    render(<Test />);
    await microtasks();
    expect(getPickedReferenceText(privateApiRef(), owner, cell(11, 'price'))).toEqual(
      'REF(COLUMN("price"), ROW(11))',
    );
    expect(getPickedReferenceText(privateApiRef(), owner, cell(10, 'q1'))).toEqual('q1');
  });

  it('writes a canonical REF with a quoted string id', async () => {
    render(
      <Test
        rows={[
          { id: 'a', item: 'Apple', price: 2, quantity: 3, q1: 4, total: 6 },
          { id: 'b', item: 'Banana', price: 1, quantity: 5, q1: 6, total: 5 },
        ]}
      />,
    );
    await microtasks();
    expect(
      getPickedReferenceText(privateApiRef(), { id: 'a', field: 'total' }, cell('b', 'price')),
    ).toEqual('REF(COLUMN("price"), ROW("b"))');
  });

  it.each([true, false])('returns null for non-pickable targets (a1Notation: %s)', async (a1) => {
    render(<Test formulaA1Notation={a1} />);
    await microtasks();
    const options = { a1Notation: a1 };
    const pickedText = (target: FormulaPickTarget) =>
      getPickedReferenceText(privateApiRef(), owner, target, options);

    // The formula's own cell.
    expect(pickedText(cell(10, 'total'))).toEqual(null);
    // Utility column.
    expect(pickedText(cell(11, GRID_CHECKBOX_SELECTION_FIELD))).toEqual(null);
    // Hidden column.
    expect(pickedText(cell(11, 'hidden'))).toEqual(null);
    // Unknown column and row.
    expect(pickedText(cell(11, 'nope'))).toEqual(null);
    expect(pickedText(cell(99, 'price'))).toEqual(null);
    // Pinned row.
    expect(pickedText(cell('summary', 'price'))).toEqual(null);
    // Actions column, same row and other row.
    expect(pickedText(cell(10, 'actions'))).toEqual(null);
    expect(pickedText(cell(11, 'actions'))).toEqual(null);
  });

  it('returns null for a filtered-out row', async () => {
    render(
      <Test
        initialState={{
          ...baselineProps.initialState,
          filter: {
            filterModel: { items: [{ field: 'item', operator: 'equals', value: 'Apple' }] },
          },
        }}
      />,
    );
    await microtasks();
    expect(getPickedReferenceText(privateApiRef(), owner, cell(11, 'price'))).toEqual(null);
  });

  it('returns null for a cell that is being edited', async () => {
    render(<Test />);
    await microtasks();
    expect(getPickedReferenceText(privateApiRef(), owner, cell(11, 'price'))).not.toEqual(null);
    await act(async () => {
      apiRef.current!.startCellEditMode({ id: 11, field: 'price' });
    });
    expect(getPickedReferenceText(privateApiRef(), owner, cell(11, 'price'))).toEqual(null);
    // Its neighbours stay pickable.
    expect(getPickedReferenceText(privateApiRef(), owner, cell(11, 'quantity'))).toEqual(
      'REF(COLUMN("quantity"), ROW(11))',
    );
  });
});
