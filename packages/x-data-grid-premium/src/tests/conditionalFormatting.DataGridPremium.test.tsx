import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import { getCell } from 'test/utils/helperFn';
import { describe, it, expect, vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridConditionalFormattingModel,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const rows = [
  { id: 0, item: 'Apple', price: 2, quantity: 3 },
  { id: 1, item: 'Banana', price: 10, quantity: 5 },
  { id: 2, item: 'Cherry', price: 30, quantity: 4 },
];

const columns = [
  { field: 'item' },
  { field: 'price', type: 'number' as const },
  { field: 'quantity', type: 'number' as const },
];

const expensive: GridConditionalFormattingModel = [
  {
    fields: ['price'],
    condition: { type: 'cell', operator: 'greaterThan', value: 5 },
    style: { color: '#ff0000', fontWeight: 'bold' },
  },
];

/**
 * The indexes of the rules that match the cell.
 */
const getRuleIndexes = (row: number, column: number) =>
  Array.from(getCell(row, column).classList)
    .map((className) => /^MuiDataGrid-conditionalFormatting-\d+-(\d+)$/.exec(className)?.[1])
    .filter((index) => index !== undefined)
    .map(Number);

describe('<DataGridPremium /> - Conditional formatting', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 400, height: 300 }}>
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          autoHeight={isJSDOM}
          disableVirtualization
          {...props}
        />
      </div>
    );
  }

  it('applies the rules to the matching cells of their columns', () => {
    render(
      <Test
        conditionalFormatting={[
          ...expensive,
          {
            fields: ['item', 'quantity'],
            condition: { type: 'text', operator: 'contains', value: 'an' },
            style: { backgroundColor: '#00ff00' },
          },
        ]}
      />,
    );

    expect(getRuleIndexes(0, 1)).to.deep.equal([]);
    expect(getRuleIndexes(1, 1)).to.deep.equal([0]);
    expect(getRuleIndexes(2, 1)).to.deep.equal([0]);
    expect(getRuleIndexes(1, 0)).to.deep.equal([1]);
    expect(getRuleIndexes(0, 0)).to.deep.equal([]);
    expect(getRuleIndexes(1, 2)).to.deep.equal([]);
  });

  it.skipIf(isJSDOM)('styles the matching cells', () => {
    render(<Test conditionalFormatting={expensive} />);

    expect(getComputedStyle(getCell(1, 1)).color).to.equal('rgb(255, 0, 0)');
    expect(getComputedStyle(getCell(1, 1)).fontWeight).to.equal('700');
    expect(getComputedStyle(getCell(0, 1)).color).not.to.equal('rgb(255, 0, 0)');
  });

  it('updates the cells when a value or the rules change', () => {
    const onConditionalFormattingChange = vi.fn();
    render(
      <Test
        initialState={{ conditionalFormatting: { model: expensive } }}
        onConditionalFormattingChange={onConditionalFormattingChange}
      />,
    );

    act(() => apiRef.current?.updateRows([{ id: 0, price: 6 }]));
    expect(getRuleIndexes(0, 1)).to.deep.equal([0]);

    const cheap: GridConditionalFormattingModel = [
      { ...expensive[0], condition: { type: 'cell', operator: 'lessThanOrEqual', value: 10 } },
    ];
    act(() => apiRef.current?.setConditionalFormatting(cheap));
    expect(onConditionalFormattingChange.mock.calls[0][0]).to.equal(cheap);
    expect(getRuleIndexes(0, 1)).to.deep.equal([0]);
    expect(getRuleIndexes(2, 1)).to.deep.equal([]);
  });

  it('exports and restores the rules with the state', () => {
    render(<Test />);
    expect(
      apiRef.current?.exportState({ exportOnlyDirtyModels: true }).conditionalFormatting,
    ).to.equal(undefined);

    act(() => apiRef.current?.restoreState({ conditionalFormatting: { model: expensive } }));
    expect(getRuleIndexes(1, 1)).to.deep.equal([0]);
    expect(apiRef.current?.exportState().conditionalFormatting).to.deep.equal({ model: expensive });
  });

  describe('formula conditions', () => {
    const formulaRule: GridConditionalFormattingModel = [
      {
        fields: ['item', 'price'],
        condition: { type: 'formula', formula: '=price * quantity > 40' },
        style: { backgroundColor: '#ffff00' },
      },
    ];

    it('applies the rule to the rows where the formula is true', () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          conditionalFormatting={formulaRule}
        />,
      );

      expect(getRuleIndexes(0, 0)).to.deep.equal([]);
      expect(getRuleIndexes(1, 0)).to.deep.equal([0]);
      expect(getRuleIndexes(2, 1)).to.deep.equal([0]);
      expect(getRuleIndexes(2, 2)).to.deep.equal([]);
    });

    it('reads computed columns', () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          computedColumns={[
            { field: 'total', headerName: 'Total', formula: '=price * quantity', type: 'number' },
          ]}
          conditionalFormatting={[
            {
              fields: ['total'],
              condition: { type: 'cell', operator: 'greaterThan', value: 40 },
              style: { color: '#000000' },
            },
            { ...formulaRule[0], condition: { type: 'formula', formula: '=total < 10' } },
          ]}
        />,
      );

      expect(getRuleIndexes(0, 0)).to.deep.equal([1]);
      expect(getRuleIndexes(1, 3)).to.deep.equal([0]);
      expect(getRuleIndexes(0, 3)).to.deep.equal([]);
    });

    it('does not match formulas that reference other rows', () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          conditionalFormatting={[
            {
              ...formulaRule[0],
              condition: { type: 'formula', formula: '=SUM(COLUMN_VALUES("price")) > 0' },
            },
          ]}
        />,
      );

      expect(getRuleIndexes(0, 0)).to.deep.equal([]);
    });

    it('warns without the formula feature', () => {
      expect(() => {
        render(<Test conditionalFormatting={formulaRule} />);
      }).toWarnDev(['MUI X Data Grid: Conditional formatting rules with a `formula` condition']);
      expect(getRuleIndexes(1, 0)).to.deep.equal([]);
    });
  });

  describe('Excel export', () => {
    it('exports the rules as conditional formats', async () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          conditionalFormatting={[
            ...expensive,
            {
              fields: ['item'],
              condition: { type: 'formula', formula: '=price > quantity' },
              style: { backgroundColor: '#ffff00' },
            },
            {
              fields: ['item'],
              condition: { type: 'formula', formula: '=WEBSERVICE("https://example.com")' },
              style: { backgroundColor: '#ffff00' },
            },
          ]}
        />,
      );

      const workbook = await act(() => apiRef.current?.getDataAsExcel());
      const worksheet = workbook!.worksheets[0] as unknown as {
        conditionalFormattings: {
          ref: string;
          rules: { formulae: string[]; priority: number }[];
        }[];
      };
      expect(
        worksheet.conditionalFormattings.map(({ ref, rules: [rule] }) => [
          ref,
          rule.formulae[0],
          rule.priority,
        ]),
      ).to.deep.equal([
        ['B2:B4', 'AND(ISNUMBER(B2),B2>5)', 1],
        ['A2:A4', 'B2>C2', 2],
      ]);
    });
  });
});
