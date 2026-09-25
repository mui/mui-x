import type { RefObject } from '@mui/x-internals/types';
import { GRID_DEFAULT_LOCALE_TEXT } from '@mui/x-data-grid-pro';
import type { GridColDef, GridLocaleText } from '@mui/x-data-grid-pro';
import { describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type {
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
} from '../computedColumns/gridComputedColumnsInterfaces';
import { ensureComputedColumnRecords } from './gridComputedColumnsRuntime';
import {
  createComputedColumnValidationScope,
  getComputedColumnVerdict,
  validateComputedColumnDefinition,
  validateComputedColumnRecords,
} from './gridComputedColumnsValidation';
import { createFormulaInternalCache, GRID_FORMULA_FUNCTIONS } from './gridFormulaUtils';

const DATA_COLUMNS: GridColDef[] = [
  { field: 'price' },
  { field: 'quantity' },
  { field: '__check__' },
];

function createHarness(
  model: GridComputedColumnsModel = [],
  options: { a1Notation?: boolean; dataColumns?: GridColDef[] } = {},
) {
  const { a1Notation = false, dataColumns = DATA_COLUMNS } = options;
  const cache = createFormulaInternalCache(GRID_FORMULA_FUNCTIONS);
  const apiRef = {
    current: {
      getLocaleText: <K extends keyof GridLocaleText>(key: K) => GRID_DEFAULT_LOCALE_TEXT[key],
      caches: { formula: cache },
    },
  } as unknown as RefObject<GridPrivateApiPremium>;

  ensureComputedColumnRecords(apiRef, cache, model, undefined);
  const lookup: Record<string, GridColDef> = {};
  dataColumns.forEach((column) => {
    lookup[column.field] = column;
  });
  validateComputedColumnRecords(apiRef, cache, lookup, a1Notation, undefined);

  const validate = (
    definition: Partial<GridComputedColumnDefinition>,
    validationOptions?: { ignoreField?: string },
  ) =>
    validateComputedColumnDefinition(
      { field: 'draft', headerName: 'Draft', formula: '=price', type: 'number', ...definition },
      createComputedColumnValidationScope(apiRef, cache, lookup, a1Notation),
      validationOptions,
    );

  return { apiRef, cache, lookup, validate };
}

const define = (field: string, formula: string): GridComputedColumnDefinition => ({
  field,
  headerName: field,
  formula,
  type: 'number',
});

describe('gridComputedColumnsValidation', () => {
  describe('validateComputedColumnDefinition', () => {
    it('should accept a definition reading data columns and computed columns', () => {
      const { validate } = createHarness([define('total', '=price * quantity')]);
      expect(validate({ formula: '=ROUND(total / quantity, 2) + price' })).to.deep.equal({
        valid: true,
        issues: [],
      });
    });

    it('should report a missing name', () => {
      const { validate } = createHarness();
      expect(validate({ headerName: '  ' }).issues).to.deep.equal([
        { code: 'nameRequired', message: 'Enter a name.' },
      ]);
    });

    it('should report a missing or an invalid field', () => {
      const { validate } = createHarness();
      expect(validate({ field: '' }).issues).to.deep.equal([
        { code: 'fieldRequired', message: 'Enter a field name.' },
      ]);
      expect(validate({ field: 'total price' }).issues).to.deep.equal([
        {
          code: 'fieldInvalid',
          message: 'Use letters, digits and underscores, starting with a letter or an underscore.',
        },
      ]);
      expect(validate({ field: '1total' }).issues[0].code).to.equal('fieldInvalid');
      expect(validate({ field: '_total_1' }).valid).to.equal(true);
    });

    it('should report the field of a data column and the field of another computed column', () => {
      const { validate } = createHarness([define('total', '=price * quantity')]);
      expect(validate({ field: 'price', formula: '=quantity' }).issues).to.deep.equal([
        {
          code: 'fieldExists',
          message: 'A column with the field "price" already exists.',
          field: 'price',
        },
      ]);
      expect(validate({ field: 'total' }).issues.map((issue) => issue.code)).to.deep.equal([
        'fieldExists',
      ]);
    });

    it('should not report the field of the stored definition passed as `ignoreField`', () => {
      const { validate } = createHarness([define('total', '=price * quantity')]);
      expect(
        validate({ field: 'total', formula: '=price * 2' }, { ignoreField: 'total' }),
      ).to.deep.equal({ valid: true, issues: [] });
      // The field of a data column is never ignored.
      expect(validate({ field: 'price' }, { ignoreField: 'price' }).valid).to.equal(false);
    });

    it('should only report a field reading as a cell address when A1 notation is active', () => {
      expect(createHarness().validate({ field: 'q1' }).valid).to.equal(true);
      expect(
        createHarness([], { a1Notation: true }).validate({ field: 'q1' }).issues,
      ).to.deep.equal([
        {
          code: 'fieldA1Like',
          message: 'This field name reads as a cell address. Choose a longer name.',
        },
      ]);
      expect(
        createHarness([], { a1Notation: true }).validate({ field: 'quarter1' }).valid,
      ).to.equal(true);
    });

    it('should report a missing formula', () => {
      const { validate } = createHarness();
      const expected = [{ code: 'formulaRequired', message: 'Enter a formula.' }];
      expect(validate({ formula: '' }).issues).to.deep.equal(expected);
      expect(validate({ formula: '= ' }).issues).to.deep.equal(expected);
    });

    it('should report a parse error with its span in the coordinates of the source', () => {
      const { validate } = createHarness();
      const [issue] = validate({ formula: '=price * )' }).issues;
      expect(issue.code).to.equal('parseError');
      expect(issue.message).to.match(/^Formula error: /);
      expect(issue.span).to.deep.equal({ start: 9, end: 10 });

      // Without the leading `=`, the source and the expression share their coordinates.
      expect(validate({ formula: 'price * )' }).issues[0].span).to.deep.equal({ start: 8, end: 9 });
    });

    it('should report an unknown function once, with its span', () => {
      const { validate } = createHarness();
      expect(validate({ formula: '=foo(price) + FOO(quantity)' }).issues).to.deep.equal([
        { code: 'unknownFunction', message: 'Unknown function FOO.', span: { start: 1, end: 11 } },
      ]);
    });

    it('should report a wrong number of arguments as a formula error', () => {
      const { validate } = createHarness();
      expect(validate({ formula: '=ABS(price, quantity)' }).issues).to.deep.equal([
        {
          code: 'parseError',
          message: 'Formula error: ABS() expects at most 1 argument(s).',
          span: { start: 1, end: 21 },
        },
      ]);
    });

    it('should report the references that are not same-row fields', () => {
      const { validate } = createHarness();
      const message =
        'Computed columns can only reference columns of the same row. Use bare field names.';
      ['=REF(COLUMN("price"), ROW(0))', '=SUM(COLUMN_VALUES("price"))'].forEach((formula) => {
        expect(validate({ formula }).issues).to.deep.equal([
          { code: 'unsupportedReference', message },
        ]);
      });
    });

    it('should report each unknown field, utility columns included', () => {
      const { validate } = createHarness();
      expect(validate({ formula: '=price * qty + __check__' }).issues).to.deep.equal([
        { code: 'unknownField', message: 'Column "qty" does not exist.', field: 'qty' },
        {
          code: 'unknownField',
          message: 'Column "__check__" does not exist.',
          field: '__check__',
        },
      ]);
    });

    it('should report a self-reference', () => {
      const { validate } = createHarness();
      expect(validate({ field: 'total', formula: '=total + 1' }).issues).to.deep.equal([
        { code: 'selfReference', message: 'A computed column cannot reference itself.' },
      ]);
    });

    it('should report the path of a cycle closed by the definition', () => {
      const { validate } = createHarness([
        define('total', '=price + 1'),
        define('tax', '=total * 0.2'),
        define('gross', '=tax * 2'),
      ]);
      expect(
        validate({ field: 'total', formula: '=gross - 1' }, { ignoreField: 'total' }).issues,
      ).to.deep.equal([
        {
          code: 'cycle',
          message: 'Circular reference: total → gross → tax → total.',
          path: ['total', 'gross', 'tax', 'total'],
        },
      ]);
    });

    it('should not report a definition that is only downstream of a cycle', () => {
      const { validate } = createHarness([define('a', '=b'), define('b', '=a')]);
      expect(validate({ formula: '=a + 1' })).to.deep.equal({ valid: true, issues: [] });
    });

    it('should report a cycle closed by the field the definition brings', () => {
      const { validate } = createHarness([define('ratio', '=future + 1')]);
      expect(validate({ field: 'future', formula: '=ratio + 1' }).issues).to.deep.equal([
        {
          code: 'cycle',
          message: 'Circular reference: future → ratio → future.',
          path: ['future', 'ratio', 'future'],
        },
      ]);
    });

    it('should report a cycle closed by the field through several stored columns', () => {
      const { validate } = createHarness([
        define('tax', '=future * 0.2'),
        define('gross', '=tax + price'),
      ]);
      expect(validate({ field: 'future', formula: '=gross - 1' }).issues).to.deep.equal([
        {
          code: 'cycle',
          message: 'Circular reference: future → gross → tax → future.',
          path: ['future', 'gross', 'tax', 'future'],
        },
      ]);
    });

    it('should accept the field a stored column is waiting for when no cycle is closed', () => {
      const { validate } = createHarness([define('ratio', '=future + 1')]);
      expect(validate({ field: 'future', formula: '=price * 2' })).to.deep.equal({
        valid: true,
        issues: [],
      });
    });

    it('should not report a cycle through a data column the field collides with', () => {
      const { validate } = createHarness([define('ratio', '=price / 2')]);
      expect(validate({ field: 'price', formula: '=ratio * 3' })).to.deep.equal({
        valid: false,
        issues: [
          {
            code: 'fieldExists',
            message: 'A column with the field "price" already exists.',
            field: 'price',
          },
        ],
      });
    });
  });

  describe('getComputedColumnVerdict', () => {
    const getStaticCode = (
      definition: Partial<GridComputedColumnDefinition>,
      model: GridComputedColumnsModel = [],
    ) => {
      const { apiRef, cache, lookup } = createHarness(model);
      const { staticResult } = getComputedColumnVerdict(
        { field: 'draft', headerName: 'Draft', formula: '=price', type: 'number', ...definition },
        createComputedColumnValidationScope(apiRef, cache, lookup, false),
      );
      return staticResult?.type === 'error' ? staticResult.code : null;
    };

    it('should only make the rows static for the issues of the formula', () => {
      expect(getStaticCode({ headerName: '', field: 'price', formula: '=quantity' })).to.equal(
        null,
      );
      expect(getStaticCode({ formula: '' })).to.equal('#ERROR!');
      expect(getStaticCode({ formula: '=price *' })).to.equal('#ERROR!');
      expect(getStaticCode({ formula: '=COLUMN_VALUES("price")' })).to.equal('#REF!');
      expect(getStaticCode({ formula: '=qty' })).to.equal('#REF!');
      expect(getStaticCode({ formula: '=draft' })).to.equal('#CYCLE!');
      expect(getStaticCode({ formula: '=IF(price > 0, price, FOO(price))' })).to.equal('#NAME?');
      expect(getStaticCode({ formula: '=ABS(price, quantity)' })).to.equal('#VALUE!');
    });
  });

  describe('validateComputedColumnRecords', () => {
    it('should store the verdict of each definition and mark the invalid headers', () => {
      const { cache } = createHarness([
        define('total', '=price * quantity'),
        define('a', '=b + 1'),
        define('b', '=a + 1'),
        define('downstream', '=a'),
        define('broken', '=missing'),
      ]);
      const { records } = cache.computedColumns;
      const getCodes = (field: string) => records.get(field)!.issues.map((issue) => issue.code);

      expect(getCodes('total')).to.deep.equal([]);
      expect(records.get('total')!.staticResult).to.equal(null);
      expect(records.get('total')!.colDef.headerClassName).to.equal(
        'MuiDataGrid-columnHeader--computed',
      );

      expect(records.get('a')!.issues[0].path).to.deep.equal(['a', 'b', 'a']);
      expect(records.get('b')!.issues[0].path).to.deep.equal(['b', 'a', 'b']);
      expect(records.get('a')!.staticResult).to.include({ type: 'error', code: '#CYCLE!' });
      expect(getCodes('downstream')).to.deep.equal([]);

      expect(getCodes('broken')).to.deep.equal(['unknownField']);
      expect(records.get('broken')!.staticResult).to.deep.equal({
        type: 'error',
        code: '#REF!',
        message: 'Column "missing" does not exist.',
      });
      expect(records.get('broken')!.colDef.headerClassName).to.equal(
        'MuiDataGrid-columnHeader--computed MuiDataGrid-columnHeader--computedInvalid',
      );
    });

    it('should keep the records whose verdict did not change and follow the columns', () => {
      const { apiRef, cache, lookup } = createHarness([define('total', '=price * quantity')]);
      const valid = cache.computedColumns.records.get('total')!;

      validateComputedColumnRecords(apiRef, cache, lookup, false, undefined);
      expect(cache.computedColumns.records.get('total')).to.equal(valid);

      delete lookup.quantity;
      validateComputedColumnRecords(apiRef, cache, lookup, false, undefined);
      const invalid = cache.computedColumns.records.get('total')!;
      expect(invalid.issues.map((issue) => issue.field)).to.deep.equal(['quantity']);
      expect(invalid.baseColDef.valueGetter).to.equal(valid.baseColDef.valueGetter);

      lookup.quantity = { field: 'quantity' };
      validateComputedColumnRecords(apiRef, cache, lookup, false, undefined);
      const recovered = cache.computedColumns.records.get('total')!;
      expect(recovered.issues).to.deep.equal([]);
      expect(recovered.staticResult).to.equal(null);
      expect(recovered.colDef.headerClassName).to.equal('MuiDataGrid-columnHeader--computed');
    });
  });
});
