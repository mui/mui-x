import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { createRenderer } from '@mui/internal-test-utils';
import { microtasks } from 'test/utils/helperFn';
import { describe, expect, it } from 'vitest';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  GRID_FORMULA_FUNCTIONS,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { getFormulaSuggestions, toFormulaFieldReference } from './gridFormulaAutocomplete';

describe('toFormulaFieldReference', () => {
  it('keeps bare identifiers as-is', () => {
    expect(toFormulaFieldReference('price')).toEqual('price');
    expect(toFormulaFieldReference('unit_price')).toEqual('unit_price');
    expect(toFormulaFieldReference('_x1')).toEqual('_x1');
  });

  it('escapes field names that are not bare identifiers', () => {
    expect(toFormulaFieldReference('unit price')).toEqual('FIELD("unit price")');
    expect(toFormulaFieldReference('2024')).toEqual('FIELD("2024")');
    expect(toFormulaFieldReference('a-b')).toEqual('FIELD("a-b")');
  });

  it('escapes field names colliding with reserved names or constants', () => {
    expect(toFormulaFieldReference('RANGE')).toEqual('FIELD("RANGE")');
    expect(toFormulaFieldReference('TRUE')).toEqual('FIELD("TRUE")');
    expect(toFormulaFieldReference('ref')).toEqual('FIELD("ref")');
  });

  it('doubles embedded quotes', () => {
    expect(toFormulaFieldReference('a"b')).toEqual('FIELD("a""b")');
  });
});

describe('getFormulaSuggestions', () => {
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

  const privateApiRef = (): RefObject<GridPrivateApiPremium> => ({
    current: unwrapPrivateAPI(apiRef.current!) as GridPrivateApiPremium,
  });

  it('returns null for non-formula values', async () => {
    render(<Test />);
    await microtasks();
    expect(getFormulaSuggestions(privateApiRef(), '42', 2, false)).toEqual(null);
    expect(getFormulaSuggestions(privateApiRef(), "'=price", 7, false)).toEqual(null);
  });

  it('suggests functions for a typed prefix', async () => {
    render(<Test />);
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=SU', 3, false)!;
    expect(state).not.toEqual(null);
    expect(state.options[0].label).toEqual('SUM');
    expect(state.options[0].kind).toEqual('function');
  });

  it('suggests same-row field references in both modes', async () => {
    render(<Test />);
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=pr', 3, false)!;
    expect(
      state.options.some((option) => option.label === 'price' && option.kind === 'field'),
    ).toEqual(true);
  });

  it('does not suggest A1 column letters when A1 notation is off', async () => {
    render(<Test />);
    await microtasks();
    // "B" is the letter of the "price" column; with A1 off it matches nothing.
    const state = getFormulaSuggestions(privateApiRef(), '=B', 2, false)!;
    expect(state.options.some((option) => option.kind === 'columnLetter')).toEqual(false);
  });

  it('suggests A1 column letters when A1 notation is on', async () => {
    render(<Test formulaA1Notation />);
    await microtasks();
    // Data columns map to A (item), B (price), C (quantity), D (total).
    const state = getFormulaSuggestions(privateApiRef(), '=B', 2, true)!;
    const letter = state.options.find((option) => option.kind === 'columnLetter');
    expect(letter?.label).toEqual('B');
    expect(letter?.detail).toEqual('price');
  });

  it('maps the replace span to full-source coordinates (including the `=`)', async () => {
    render(<Test />);
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=SU', 3, false)!;
    expect(state.replaceStart).toEqual(1);
    expect(state.replaceEnd).toEqual(3);
    expect(state.token).toEqual('SU');
  });

  it('surfaces custom functions with their metadata', async () => {
    render(
      <Test
        formulaFunctions={{
          ...GRID_FORMULA_FUNCTIONS,
          TAX: {
            name: 'TAX',
            minArgs: 1,
            maxArgs: 1,
            signature: 'TAX(amount)',
            description: 'Adds tax.',
            apply: () => 0,
          },
        }}
      />,
    );
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=TA', 3, false)!;
    const tax = state.options.find((option) => option.label === 'TAX');
    expect(tax).toMatchObject({ kind: 'function', signature: 'TAX(amount)' });
  });

  it('provides signature help while the caret is inside a call', async () => {
    render(<Test />);
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=ROUND(price, ', 14, false)!;
    expect(state.signatureHelp).toMatchObject({
      name: 'ROUND',
      signature: 'ROUND(value, [digits])',
      argIndex: 1,
    });
  });

  it('suppresses suggestions inside a string literal', async () => {
    render(<Test />);
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=FIELD("pr', 10, false)!;
    expect(state.options).toEqual([]);
  });

  it('provides signature help for a custom function with a non-uppercase name', async () => {
    render(
      <Test
        formulaFunctions={{
          ...GRID_FORMULA_FUNCTIONS,
          calcShipping: {
            name: 'calcShipping',
            minArgs: 1,
            maxArgs: 1,
            signature: 'calcShipping(weight)',
            apply: () => 0,
          },
        }}
      />,
    );
    await microtasks();
    const state = getFormulaSuggestions(privateApiRef(), '=calcShipping(', 14, false)!;
    expect(state.signatureHelp).toMatchObject({
      name: 'calcShipping',
      signature: 'calcShipping(weight)',
    });
  });

  it('suggests hidden columns as same-row field references', async () => {
    render(<Test initialState={{ columns: { columnVisibilityModel: { price: false } } }} />);
    await microtasks();
    // A bare reference to a hidden field still evaluates, so it is offered.
    const state = getFormulaSuggestions(privateApiRef(), '=pr', 3, false)!;
    expect(
      state.options.some((option) => option.label === 'price' && option.kind === 'field'),
    ).toEqual(true);
  });
});
