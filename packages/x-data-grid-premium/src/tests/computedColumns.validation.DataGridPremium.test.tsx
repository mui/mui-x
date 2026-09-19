import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import { getCell, getColumnHeaderCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import {
  DataGridPremium,
  useGridApiRef,
  gridClasses,
  gridColumnFieldsSelector,
} from '@mui/x-data-grid-premium';
import { GRID_FORMULA_FUNCTIONS, formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridApi,
  GridComputedColumnDefinition,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';

const define = (
  field: string,
  formula: string,
  other: Partial<GridComputedColumnDefinition> = {},
): GridComputedColumnDefinition => ({
  field,
  headerName: field,
  formula,
  type: 'number',
  ...other,
});

const total = define('total', '=price * quantity', { headerName: 'Total' });

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  rows: [
    { id: 0, item: 'Apple', price: 2, quantity: 3, zero: 0 },
    { id: 1, item: 'Banana', price: 10, quantity: 5, zero: 0 },
    { id: 2, item: 'Cherry', price: 4, quantity: 2, zero: 1 },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number' },
    { field: 'quantity', type: 'number' },
    { field: 'zero', type: 'number' },
  ],
};

const BADGE_SELECTOR = `.${gridClasses.computedColumnHeaderBadge}`;
const LETTER_SELECTOR = `.${gridClasses.formulaColumnHeaderLetter}`;

describe('<DataGridPremium /> - Computed columns validation', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 800, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  const getPrivateApi = () => unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!);
  const getFieldIndex = (field: string) =>
    gridColumnFieldsSelector(apiRef as RefObject<GridApi>).indexOf(field);
  const getColumnValuesOf = (field: string) => getColumnValues(getFieldIndex(field));
  const getHeader = (field: string) => getColumnHeaderCell(getFieldIndex(field));
  const getIssueCodes = (field: string) =>
    getPrivateApi().getComputedColumnIssues!(field).map((issue) => issue.code);
  const isHeaderInvalid = (field: string) =>
    getHeader(field).classList.contains(gridClasses['columnHeader--computedInvalid']);
  const getCellTooltip = (rowIndex: number, field: string) =>
    getCell(rowIndex, getFieldIndex(field)).querySelector('span')!.getAttribute('title');

  describe('stored definitions', () => {
    it('should have no issue and a regular header when the definition is valid', async () => {
      await render(<Test computedColumns={[total]} />);
      expect(getIssueCodes('total')).to.deep.equal([]);
      expect(getIssueCodes('unknown')).to.deep.equal([]);
      expect(getHeader('total')).to.have.class(gridClasses['columnHeader--computed']);
      expect(isHeaderInvalid('total')).to.equal(false);
      expect(getHeader('price')).not.to.have.class(gridClasses['columnHeader--computed']);
    });

    it('should show `#REF!` in every row of a column reading an unknown field', async () => {
      await render(<Test computedColumns={[define('broken', '=price * qty')]} />);
      expect(getColumnValuesOf('broken')).to.deep.equal(['#REF!', '#REF!', '#REF!']);
      expect(getPrivateApi().getComputedColumnIssues!('broken')).to.deep.equal([
        { code: 'unknownField', message: 'Column "qty" does not exist.', field: 'qty' },
      ]);
      expect(isHeaderInvalid('broken')).to.equal(true);
      expect(getCellTooltip(0, 'broken')).to.equal('Column "qty" does not exist.');
    });

    it('should show `#ERROR!` for a formula that cannot be parsed and `#REF!` for a reference to another row', async () => {
      await render(
        <Test
          computedColumns={[
            define('syntax', '=price *'),
            define('otherRow', '=REF(COLUMN("price"), ROW(0))'),
          ]}
        />,
      );
      expect(getColumnValuesOf('syntax')).to.deep.equal(['#ERROR!', '#ERROR!', '#ERROR!']);
      expect(getIssueCodes('syntax')).to.deep.equal(['parseError']);
      expect(getColumnValuesOf('otherRow')).to.deep.equal(['#REF!', '#REF!', '#REF!']);
      expect(getIssueCodes('otherRow')).to.deep.equal(['unsupportedReference']);
      expect(getCellTooltip(0, 'otherRow')).to.equal(
        'Computed columns can only reference columns of the same row. Use bare field names.',
      );
    });

    it('should show `#CYCLE!` in the columns of a cycle and keep the downstream column valid', async () => {
      await render(
        <Test
          computedColumns={[
            define('a', '=b + 1'),
            define('b', '=a + 1'),
            define('own', '=own + 1'),
            define('downstream', '=a * 2'),
          ]}
        />,
      );
      ['a', 'b', 'own', 'downstream'].forEach((field) => {
        expect(getColumnValuesOf(field)).to.deep.equal(['#CYCLE!', '#CYCLE!', '#CYCLE!']);
      });
      expect(getPrivateApi().getComputedColumnIssues!('a')).to.deep.equal([
        { code: 'cycle', message: 'Circular reference: a → b → a.', path: ['a', 'b', 'a'] },
      ]);
      expect(getIssueCodes('own')).to.deep.equal(['selfReference']);
      expect(getIssueCodes('downstream')).to.deep.equal([]);
      expect(isHeaderInvalid('a')).to.equal(true);
      expect(isHeaderInvalid('own')).to.equal(true);
      expect(isHeaderInvalid('downstream')).to.equal(false);
    });

    it('should show `#NAME?` in every row for an unknown function, even in a branch that is not evaluated', async () => {
      await render(
        <Test computedColumns={[define('lazy', '=IF(price > 0, price, MISSING(price))')]} />,
      );
      expect(getColumnValuesOf('lazy')).to.deep.equal(['#NAME?', '#NAME?', '#NAME?']);
      expect(getIssueCodes('lazy')).to.deep.equal(['unknownFunction']);
      expect(getCellTooltip(0, 'lazy')).to.equal('Unknown function MISSING.');
    });

    it('should show `#VALUE!` in every row for a wrong number of arguments', async () => {
      await render(<Test computedColumns={[define('arity', '=ABS(price, quantity)')]} />);
      expect(getColumnValuesOf('arity')).to.deep.equal(['#VALUE!', '#VALUE!', '#VALUE!']);
      expect(getIssueCodes('arity')).to.deep.equal(['parseError']);
      expect(isHeaderInvalid('arity')).to.equal(true);
    });

    it('should keep evaluating a definition whose only issue is its name', async () => {
      await render(<Test computedColumns={[{ ...total, headerName: '' }]} />);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(getIssueCodes('total')).to.deep.equal(['nameRequired']);
      expect(isHeaderInvalid('total')).to.equal(false);
    });

    it('should report a field reading as a cell address when A1 notation is active', async () => {
      const { setProps } = await render(
        <Test computedColumns={[define('q1', '=price * quantity')]} />,
      );
      expect(getIssueCodes('q1')).to.deep.equal([]);
      setProps({ formulaA1Notation: true });
      await microtasks();
      expect(getIssueCodes('q1')).to.deep.equal(['fieldA1Like']);
      expect(isHeaderInvalid('q1')).to.equal(false);
    });
  });

  describe('revalidation', () => {
    it('should invalidate a column when a column it reads is removed and recover when it comes back', async () => {
      const { setProps } = await render(<Test computedColumns={[total]} />);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);

      setProps({
        columns: baselineProps.columns.filter((column) => column.field !== 'quantity'),
      });
      await microtasks();
      expect(getColumnValuesOf('total')).to.deep.equal(['#REF!', '#REF!', '#REF!']);
      expect(isHeaderInvalid('total')).to.equal(true);
      expect(getPrivateApi().getComputedColumnIssues!('total')).to.deep.equal([
        { code: 'unknownField', message: 'Column "quantity" does not exist.', field: 'quantity' },
      ]);

      setProps({ columns: baselineProps.columns });
      await microtasks();
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(isHeaderInvalid('total')).to.equal(false);
      expect(getIssueCodes('total')).to.deep.equal([]);
    });

    it('should invalidate the columns reading a removed computed column', async () => {
      await render(
        <Test
          initialState={{ computedColumns: { model: [total, define('tax', '=total * 0.5')] } }}
        />,
      );
      expect(getColumnValuesOf('tax')).to.deep.equal(['3', '25', '4']);
      act(() => apiRef.current!.removeComputedColumn('total'));
      expect(getColumnValuesOf('tax')).to.deep.equal(['#REF!', '#REF!', '#REF!']);
      expect(getIssueCodes('tax')).to.deep.equal(['unknownField']);
    });

    it('should validate again when an update of the model closes or opens a cycle', async () => {
      await render(
        <Test
          initialState={{ computedColumns: { model: [total, define('tax', '=total * 0.5')] } }}
        />,
      );
      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=tax + 1' }));
      expect(getColumnValuesOf('tax')).to.deep.equal(['#CYCLE!', '#CYCLE!', '#CYCLE!']);
      expect(getIssueCodes('tax')).to.deep.equal(['cycle']);
      expect(isHeaderInvalid('tax')).to.equal(true);

      act(() => apiRef.current!.updateComputedColumn('total', { formula: '=price * quantity' }));
      expect(getColumnValuesOf('tax')).to.deep.equal(['3', '25', '4']);
      expect(getIssueCodes('tax')).to.deep.equal([]);
      expect(isHeaderInvalid('tax')).to.equal(false);
    });

    it('should validate again when `formulaFunctions` changes', async () => {
      const withBoost = {
        ...GRID_FORMULA_FUNCTIONS,
        BOOST: {
          name: 'BOOST',
          minArgs: 1,
          maxArgs: 1,
          apply: (args: any[]) => (args[0] as number) * 2,
        },
      };
      const { setProps } = await render(
        <Test
          computedColumns={[define('custom', '=BOOST(price)')]}
          formulaFunctions={withBoost as any}
        />,
      );
      expect(getColumnValuesOf('custom')).to.deep.equal(['4', '20', '8']);

      setProps({ formulaFunctions: GRID_FORMULA_FUNCTIONS });
      await microtasks();
      expect(getColumnValuesOf('custom')).to.deep.equal(['#NAME?', '#NAME?', '#NAME?']);
      expect(getIssueCodes('custom')).to.deep.equal(['unknownFunction']);
      expect(isHeaderInvalid('custom')).to.equal(true);

      setProps({ formulaFunctions: withBoost });
      await microtasks();
      expect(getColumnValuesOf('custom')).to.deep.equal(['4', '20', '8']);
      expect(isHeaderInvalid('custom')).to.equal(false);
    });
  });

  describe('API', () => {
    it('should validate a definition against the columns and the stored definitions', async () => {
      await render(<Test computedColumns={[total]} />);
      const { validateComputedColumnDefinition } = getPrivateApi();
      expect(validateComputedColumnDefinition!(define('margin', '=total - price'))).to.deep.equal({
        valid: true,
        issues: [],
      });
      expect(
        validateComputedColumnDefinition!(define('total', '=price')).issues.map(
          (issue) => issue.code,
        ),
      ).to.deep.equal(['fieldExists']);
      expect(
        validateComputedColumnDefinition!(define('total', '=price'), { ignoreField: 'total' })
          .valid,
      ).to.equal(true);
    });

    it('should validate a definition whose field is stored as the replacement of the stored one', async () => {
      await render(<Test computedColumns={[total]} />);
      expect(
        apiRef.current!.validateComputedColumn({ ...total, formula: '=price * quantity * 2' }),
      ).to.deep.equal({ valid: true, issues: [] });
      expect(
        apiRef
          .current!.validateComputedColumn({ ...total, formula: '=total * 2' })
          .issues.map((issue) => issue.code),
      ).to.deep.equal(['selfReference']);
      // The field of a data column is never the one of a stored definition.
      expect(
        apiRef
          .current!.validateComputedColumn(define('price', '=quantity'))
          .issues.map((issue) => issue.code),
      ).to.deep.equal(['fieldExists']);
    });

    it('should use the locale text of the grid', async () => {
      await render(
        <Test
          computedColumns={[total]}
          localeText={{ computedColumnErrorUnknownField: (field) => `No column ${field}` }}
        />,
      );
      expect(apiRef.current!.validateComputedColumn(define('draft', '=qty')).issues).to.deep.equal([
        { code: 'unknownField', message: 'No column qty', field: 'qty' },
      ]);
    });
  });

  describe('error cell', () => {
    it('should explain the error of a row in a tooltip', async () => {
      await render(
        <Test
          computedColumns={[
            define('ratio', '=price / zero'),
            define('text', '=item * 2'),
            define('flag', '=price / zero > 1', { type: 'boolean' }),
          ]}
        />,
      );
      expect(getColumnValuesOf('ratio')).to.deep.equal(['#DIV/0!', '#DIV/0!', '4']);
      expect(getCell(0, getFieldIndex('ratio'))).to.have.class(gridClasses['cell--computedError']);
      expect(getCellTooltip(0, 'ratio')).to.match(
        /^Division by zero in this row\. Wrap the division in IFERROR\(…, 0\) to provide a fallback\./,
      );
      expect(getCell(2, getFieldIndex('ratio')).querySelector('span[title]')).to.equal(null);

      expect(getColumnValuesOf('text')).to.deep.equal(['#VALUE!', '#VALUE!', '#VALUE!']);
      expect(getCellTooltip(0, 'text')).to.match(
        /^A value in this row has the wrong type for this operation\./,
      );

      // The columns whose type has its own renderer show the error too.
      expect(getCellTooltip(0, 'flag')).to.match(/^Division by zero in this row\./);
    });

    it('should append the message of the engine to the cause', async () => {
      await render(<Test computedColumns={[define('typed', '=item')]} />);
      expect(getCellTooltip(0, 'typed')).to.equal(
        'A value in this row has the wrong type for this operation. The formula result is not a number.',
      );
    });

    it('should use the generic cause for the other error codes', async () => {
      const formulaFunctions = {
        ...GRID_FORMULA_FUNCTIONS,
        FAIL: {
          name: 'FAIL',
          minArgs: 0,
          maxArgs: 0,
          apply: () => ({ kind: 'error', code: '#ERROR!', message: 'Boom.' }),
        },
      };
      await render(
        <Test
          computedColumns={[define('failing', '=FAIL()')]}
          formulaFunctions={formulaFunctions as any}
        />,
      );
      expect(getColumnValuesOf('failing')).to.deep.equal(['#ERROR!', '#ERROR!', '#ERROR!']);
      expect(getIssueCodes('failing')).to.deep.equal([]);
      expect(getCellTooltip(0, 'failing')).to.equal(
        'The formula could not be evaluated for this row. Boom.',
      );
    });
  });

  describe('header badge', () => {
    it('should mark the computed columns with a badge showing the formula', async () => {
      await render(<Test computedColumns={[total]} />);
      const badge = getHeader('total').querySelector(BADGE_SELECTOR)!;
      expect(badge).to.have.text('ƒx');
      expect(badge).to.have.attribute('role', 'img');
      expect(badge).to.have.attribute('aria-label', 'Computed column');
      expect(badge).to.have.attribute('title', '=price * quantity');
      expect(getHeader('price').querySelector(BADGE_SELECTOR)).to.equal(null);
    });

    it('should tell when the formula is invalid and follow the definition', async () => {
      await render(
        <Test initialState={{ computedColumns: { model: [define('broken', '=price * qty')] } }} />,
      );
      expect(getHeader('broken').querySelector(BADGE_SELECTOR)).to.have.attribute(
        'aria-label',
        'Computed column with an invalid formula',
      );

      act(() => apiRef.current!.updateComputedColumn('broken', { formula: '=price * quantity' }));
      const badge = getHeader('broken').querySelector(BADGE_SELECTOR)!;
      expect(badge).to.have.attribute('aria-label', 'Computed column');
      expect(badge).to.have.attribute('title', '=price * quantity');
    });

    it('should render no badge without computed columns', async () => {
      await render(<Test />);
      expect(document.querySelector(BADGE_SELECTOR)).to.equal(null);
    });

    it('should render the badge before the A1 column letter', async () => {
      await render(<Test computedColumns={[total]} formulaA1Notation />);
      const header = getHeader('total');
      const badge = header.querySelector(BADGE_SELECTOR)!;
      const letter = header.querySelector(LETTER_SELECTOR)!;
      expect(letter).to.have.text('E');
      expect(badge.nextElementSibling).to.equal(letter);
      expect(getHeader('price').querySelector(LETTER_SELECTOR)).to.have.text('B');
    });

    it('should merge the `headerClassName` of `computedColDef` with the computed classes', async () => {
      await render(
        <Test
          computedColumns={[define('broken', '=qty')]}
          computedColDef={{ headerClassName: 'custom-header' }}
        />,
      );
      const header = getHeader('broken');
      expect(header).to.have.class('custom-header');
      expect(header).to.have.class(gridClasses['columnHeader--computed']);
      expect(header).to.have.class(gridClasses['columnHeader--computedInvalid']);
    });
  });
});
