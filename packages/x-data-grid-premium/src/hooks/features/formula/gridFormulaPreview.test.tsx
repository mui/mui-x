import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer } from '@mui/internal-test-utils';
import { microtasks } from 'test/utils/helperFn';
import { describe, expect, it } from 'vitest';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import type { DataGridPremiumProps, GridApi } from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { previewFormulaResult } from './gridFormulaPreview';

describe('previewFormulaResult', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const baselineProps: DataGridPremiumProps = {
    autoHeight: true,
    rows: [
      { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=price * quantity' },
      { id: 1, item: 'Banana', price: 1, quantity: 5, total: '=price * quantity' },
    ],
    columns: [
      { field: 'item' },
      { field: 'price', type: 'number' },
      { field: 'quantity', type: 'number' },
      { field: 'total', type: 'number', allowFormulas: true, editable: true },
    ],
  };

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  function privateApi(): RefObject<GridPrivateApiPremium> {
    return { current: unwrapPrivateAPI(apiRef.current!) };
  }

  it('returns null for a non-formula draft', async () => {
    render(<Test />);
    await microtasks();
    expect(
      previewFormulaResult(privateApi(), { id: 0, field: 'total' }, '12', {
        a1Notation: false,
      }),
    ).to.equal(null);
  });

  it('returns the unescaped string for an escaped literal draft', async () => {
    render(<Test />);
    await microtasks();
    expect(
      previewFormulaResult(privateApi(), { id: 0, field: 'total' }, "'=not a formula", {
        a1Notation: false,
      }),
    ).to.deep.equal({ type: 'value', value: '=not a formula' });
  });

  it('evaluates a same-row draft against raw values', async () => {
    render(<Test />);
    await microtasks();
    expect(
      previewFormulaResult(privateApi(), { id: 0, field: 'total' }, '=price * quantity + 1', {
        a1Notation: false,
      }),
    ).to.deep.equal({ type: 'value', value: 7 });
  });

  it('resolves formula-cell dependencies from the committed lookup', async () => {
    render(<Test />);
    await microtasks();
    // total of row 1 is a committed formula evaluating to 5.
    expect(
      previewFormulaResult(
        privateApi(),
        { id: 0, field: 'item' },
        '=REF(COLUMN("total"), ROW(1)) * 2',
        { a1Notation: false },
      ),
    ).to.deep.equal({ type: 'value', value: 10 });
  });

  it('reads raw dependencies through the column valueGetter', async () => {
    render(
      <Test
        columns={[
          ...baselineProps.columns!,
          { field: 'double', type: 'number', valueGetter: (value, row) => row.price * 2 },
        ]}
      />,
    );
    await microtasks();
    expect(
      previewFormulaResult(privateApi(), { id: 0, field: 'total' }, '=double + 1', {
        a1Notation: false,
      }),
    ).to.deep.equal({ type: 'value', value: 5 });
  });

  it('previews evaluation errors', async () => {
    render(<Test />);
    await microtasks();
    const result = previewFormulaResult(privateApi(), { id: 0, field: 'total' }, '=1 / 0', {
      a1Notation: false,
    });
    expect(result?.type).to.equal('error');
    expect((result as { code: string }).code).to.equal('#DIV/0!');
  });

  it('previews parse errors as #ERROR!', async () => {
    render(<Test />);
    await microtasks();
    const result = previewFormulaResult(privateApi(), { id: 0, field: 'total' }, '=1 +', {
      a1Notation: false,
    });
    expect(result?.type).to.equal('error');
    expect((result as { code: string }).code).to.equal('#ERROR!');
  });

  it('reports a direct self-reference as #CYCLE!', async () => {
    render(<Test />);
    await microtasks();
    const result = previewFormulaResult(
      privateApi(),
      { id: 0, field: 'total' },
      '=REF(COLUMN("total"), ROW(0)) + 1',
      { a1Notation: false },
    );
    expect(result?.type).to.equal('error');
    expect((result as { code: string }).code).to.equal('#CYCLE!');
  });

  it('reports a self-reference through COLUMN_VALUES as #CYCLE!', async () => {
    // The evaluator alone would read the cell's committed value and produce a
    // plausible-but-wrong number — the committed pass yields #CYCLE! instead.
    render(<Test />);
    await microtasks();
    const result = previewFormulaResult(
      privateApi(),
      { id: 0, field: 'total' },
      '=SUM(COLUMN_VALUES("total"))',
      { a1Notation: false },
    );
    expect(result?.type).to.equal('error');
    expect((result as { code: string }).code).to.equal('#CYCLE!');
  });

  it('does not report a range cycle when the own row is filtered out', async () => {
    render(
      <Test filterModel={{ items: [{ field: 'item', operator: 'equals', value: 'Banana' }] }} />,
    );
    await microtasks();
    // Row 0 has no position: COLUMN_VALUES("total") covers only row 1 (= 5).
    expect(
      previewFormulaResult(
        privateApi(),
        { id: 0, field: 'total' },
        '=SUM(COLUMN_VALUES("total"))',
        {
          a1Notation: false,
        },
      ),
    ).to.deep.equal({ type: 'value', value: 5 });
  });

  it('resolves position-based references against the current view', async () => {
    render(<Test />);
    await microtasks();
    expect(
      previewFormulaResult(
        privateApi(),
        { id: 0, field: 'item' },
        '=REF(COLUMN("price"), ROW_POSITION(2))',
        { a1Notation: false },
      ),
    ).to.deep.equal({ type: 'value', value: 1 });
  });

  it('converts an A1 draft before evaluating', async () => {
    render(<Test formulaA1Notation />);
    await microtasks();
    // Columns: A=item, B=price, C=quantity, D=total; row 1 of the view is id 0.
    expect(
      previewFormulaResult(privateApi(), { id: 1, field: 'item' }, '=B1 * 10', {
        a1Notation: true,
      }),
    ).to.deep.equal({ type: 'value', value: 20 });
  });

  it('writes nothing to the evaluation cache', async () => {
    render(<Test />);
    await microtasks();
    const api = privateApi();
    const cache = api.current.caches.formula;
    const trackedBefore = new Map(
      Array.from(cache.trackedValues.entries(), ([key, values]) => [key, values.size]),
    );
    const recordsBefore = cache.records.size;
    previewFormulaResult(api, { id: 0, field: 'item' }, '=quantity + price', {
      a1Notation: false,
    });
    previewFormulaResult(api, { id: 0, field: 'item' }, '=SUM(COLUMN_VALUES("price"))', {
      a1Notation: false,
    });
    expect(cache.records.size).to.equal(recordsBefore);
    expect(
      Array.from(cache.trackedValues.entries(), ([key, values]) => [key, values.size]),
    ).to.deep.equal(Array.from(trackedBefore.entries()));
  });
});
