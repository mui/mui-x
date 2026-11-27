import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import { getCell, microtasks } from 'test/utils/helperFn';
import { describe, it, expect, vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridConditionalFormattingModel,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    type: 'highlight',
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
            type: 'highlight',
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

  it('keeps date rules working through a JSON round trip of the state', () => {
    render(
      <Test
        rows={[{ id: 0, day: new Date(2023, 5, 1) }]}
        columns={[{ field: 'day', type: 'date' }]}
        initialState={{
          conditionalFormatting: {
            model: [
              {
                type: 'highlight',
                fields: ['day'],
                condition: { type: 'cell', operator: 'lessThan', value: new Date(2024, 0, 1) },
                style: { color: '#000000' },
              },
            ],
          },
        }}
      />,
    );
    expect(getRuleIndexes(0, 0)).to.deep.equal([0]);

    const saved = JSON.parse(JSON.stringify(apiRef.current?.exportState()));
    act(() => apiRef.current?.setConditionalFormatting([]));
    expect(getRuleIndexes(0, 0)).to.deep.equal([]);
    act(() => apiRef.current?.restoreState(saved));
    expect(getRuleIndexes(0, 0)).to.deep.equal([0]);
  });

  it('ignores a restored model that is not an array', async () => {
    render(<Test />);
    act(() => apiRef.current?.restoreState({ conditionalFormatting: { model: {} as any } }));
    expect(getRuleIndexes(1, 1)).to.deep.equal([]);
    expect(await act(() => apiRef.current?.getDataAsExcel())).not.to.equal(null);
  });

  it('formats the parent rows of tree data', () => {
    render(
      <Test
        treeData
        getTreeDataPath={(row) => row.path}
        rows={[
          { id: 0, path: ['a'], price: 50 },
          { id: 1, path: ['a', 'b'], price: 60 },
        ]}
        columns={[{ field: 'price', type: 'number' }]}
        defaultGroupingExpansionDepth={-1}
        conditionalFormatting={expensive}
      />,
    );
    const getPriceCell = (id: number) =>
      document.querySelector(`[data-id="${id}"] [data-field="price"]`)!;

    expect(getPriceCell(0).className).to.match(/MuiDataGrid-conditionalFormatting-\d+-0/);
    expect(getPriceCell(1).className).to.match(/MuiDataGrid-conditionalFormatting-\d+-0/);
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

  it('formats pinned rows, but not group and aggregation rows', async () => {
    render(
      <Test
        conditionalFormatting={expensive}
        pinnedRows={{ top: [{ id: 'pinned', item: 'Pinned', price: 9, quantity: 1 }] }}
        rowGroupingModel={['item']}
        aggregationModel={{ price: 'sum' }}
        defaultGroupingExpansionDepth={-1}
      />,
    );
    await microtasks();
    const getPriceCell = (id: string) =>
      document.querySelector(`[data-id="${id}"] [data-field="price"]`)!;

    expect(getPriceCell('pinned').className).to.match(/MuiDataGrid-conditionalFormatting-\d+-0/);
    expect(getPriceCell('auto-generated-row-item/Banana').className).not.to.match(
      /MuiDataGrid-conditionalFormatting/,
    );
    expect(getPriceCell('1').className).to.match(/MuiDataGrid-conditionalFormatting-\d+-0/);
    expect(getPriceCell('auto-generated-group-footer-root').className).not.to.match(
      /MuiDataGrid-conditionalFormatting/,
    );
  });

  it('matches the text the export writes for single select columns', () => {
    render(
      <Test
        rows={[{ id: 0, status: 'd' }]}
        columns={[
          {
            field: 'status',
            type: 'singleSelect',
            valueOptions: [{ value: 'd', label: 'Discontinued' }],
          },
        ]}
        conditionalFormatting={[
          {
            type: 'highlight',
            fields: ['status'],
            condition: { type: 'text', operator: 'contains', value: 'disc' },
            style: { color: '#000000' },
          },
        ]}
      />,
    );

    expect(getRuleIndexes(0, 0)).to.deep.equal([0]);
  });

  it('updates the cells when the columns or the controlled rules change', () => {
    const { setProps } = render(<Test conditionalFormatting={expensive} />);
    expect(getRuleIndexes(0, 1)).to.deep.equal([]);

    setProps({
      columns: [
        columns[0],
        { ...columns[1], valueGetter: (value: number) => value * 10 },
        columns[2],
      ],
    });
    expect(getRuleIndexes(0, 1)).to.deep.equal([0]);

    setProps({
      conditionalFormatting: [
        { ...expensive[0], condition: { type: 'cell', operator: 'greaterThan', value: 1000 } },
      ],
    });
    expect(getRuleIndexes(0, 1)).to.deep.equal([]);
  });

  it.skipIf(isJSDOM)('gives background-only rules a readable text color in dark mode', () => {
    render(
      <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
        <Test
          conditionalFormatting={[
            { ...expensive[0], style: { backgroundColor: '#c8e6c9' } },
            {
              type: 'highlight',
              fields: ['price'],
              condition: { type: 'cell', operator: 'greaterThan', value: 20 },
              style: { color: '#ff0000' },
            },
          ]}
        />
      </ThemeProvider>,
    );

    expect(getComputedStyle(getCell(1, 1)).color).to.equal('rgb(0, 0, 0)');
    // A lower-priority rule that sets a text color still wins over the automatic one.
    expect(getComputedStyle(getCell(2, 1)).color).to.equal('rgb(255, 0, 0)');
  });

  it.skipIf(isJSDOM)('keeps the selection background of selected rows', () => {
    render(
      <Test
        conditionalFormatting={[{ ...expensive[0], style: { backgroundColor: '#ff0000' } }]}
        rowSelectionModel={{ type: 'include', ids: new Set([1]) }}
      />,
    );

    expect(getComputedStyle(getCell(1, 1)).backgroundColor).not.to.equal('rgb(255, 0, 0)');
    expect(getComputedStyle(getCell(2, 1)).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  describe('formula conditions', () => {
    const formulaRule: GridConditionalFormattingModel = [
      {
        type: 'highlight',
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
              type: 'highlight',
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

    it('has no effect with disableFormulas', () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          disableFormulas
          conditionalFormatting={formulaRule}
        />,
      );

      expect(getRuleIndexes(1, 0)).to.deep.equal([]);
    });

    it('warns without the formula feature', () => {
      expect(() => {
        render(<Test conditionalFormatting={formulaRule} />);
      }).toWarnDev(['MUI X Data Grid: Conditional formatting rules with a `formula` condition']);
      expect(getRuleIndexes(1, 0)).to.deep.equal([]);
    });
  });

  describe('Excel export', () => {
    it('starts the formats below the column group headers and covers pinned rows', async () => {
      render(
        <Test
          conditionalFormatting={expensive}
          pinnedRows={{ top: [{ id: 'pinned', item: 'Pinned', price: 9, quantity: 1 }] }}
          columnGroupingModel={[{ groupId: 'Prices', children: [{ field: 'price' }] }]}
        />,
      );

      const workbook = await act(() =>
        apiRef.current?.getDataAsExcel({ includeColumnGroupsHeaders: true }),
      );
      const worksheet = workbook!.worksheets[0] as unknown as {
        conditionalFormattings: { ref: string }[];
        getCell: (address: string) => { value: unknown };
      };
      const [{ ref }] = worksheet.conditionalFormattings;
      expect(ref).to.equal('B3:B6');
      expect(worksheet.getCell('B3').value).to.equal(9);
    });

    it('exports the rules as conditional formats', async () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          conditionalFormatting={[
            ...expensive,
            {
              type: 'highlight',
              fields: ['item'],
              condition: { type: 'formula', formula: '=price > quantity' },
              style: { backgroundColor: '#ffff00' },
            },
            {
              type: 'highlight',
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

    it('skips group and aggregation rows', async () => {
      render(
        <Test
          rows={[
            { id: 0, item: 'a', price: 3, quantity: 1 },
            { id: 1, item: 'a', price: 4, quantity: 1 },
          ]}
          conditionalFormatting={[
            { ...expensive[0], condition: { type: 'cell', operator: 'greaterThan', value: 2 } },
          ]}
          rowGroupingModel={['item']}
          aggregationModel={{ price: 'sum' }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      const workbook = await act(() => apiRef.current?.getDataAsExcel());
      const worksheet = workbook!.worksheets[0];
      const formattedValues = (
        worksheet as unknown as { conditionalFormattings: { ref: string }[] }
      ).conditionalFormattings.flatMap(({ ref }) => {
        const [, letter, first, last] = /^([A-Z]+)(\d+):[A-Z]+(\d+)$/.exec(ref)!;
        const values = [];
        for (let rowNumber = Number(first); rowNumber <= Number(last); rowNumber += 1) {
          values.push(worksheet.getCell(`${letter}${rowNumber}`).value);
        }
        return values;
      });
      expect(formattedValues).to.deep.equal([3, 4]);
    });
  });
});
