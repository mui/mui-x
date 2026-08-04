import { createFormulaFunctionRegistry, FORMULA_BUILT_IN_FUNCTIONS } from './formulaFunctions';

describe('formulaFunctions', () => {
  describe('createFormulaFunctionRegistry', () => {
    it('exposes every built-in by name', () => {
      const registry = createFormulaFunctionRegistry();
      for (const definition of FORMULA_BUILT_IN_FUNCTIONS) {
        expect(registry.get(definition.name)?.name).to.equal(definition.name);
      }
      expect(registry.names()).to.have.length(FORMULA_BUILT_IN_FUNCTIONS.length);
    });

    it('looks functions up case-insensitively', () => {
      const registry = createFormulaFunctionRegistry();
      expect(registry.get('sum')?.name).to.equal('SUM');
      expect(registry.get('Sum')?.name).to.equal('SUM');
    });

    it('registers CONCATENATE as an alias of CONCAT', () => {
      const registry = createFormulaFunctionRegistry();
      expect(registry.get('CONCATENATE')?.apply).to.equal(registry.get('CONCAT')?.apply);
    });

    it('replaces the built-ins when a function set is provided', () => {
      // The argument is the COMPLETE function set (cf. the aggregationFunctions
      // prop): an empty set yields an empty registry.
      expect(createFormulaFunctionRegistry([]).names()).to.deep.equal([]);
      expect(createFormulaFunctionRegistry([]).get('SUM')).to.equal(undefined);

      const sum = FORMULA_BUILT_IN_FUNCTIONS.find((definition) => definition.name === 'SUM')!;
      const curated = createFormulaFunctionRegistry([sum]);
      expect(curated.names()).to.deep.equal(['SUM']);
      expect(curated.get('POWER')).to.equal(undefined);
    });

    it('lets later definitions override earlier ones by name', () => {
      const custom = {
        name: 'SUM',
        minArgs: 0,
        maxArgs: 0,
        apply: () => 42 as const,
      };
      const registry = createFormulaFunctionRegistry([...FORMULA_BUILT_IN_FUNCTIONS, custom]);
      expect(registry.get('SUM')).to.equal(custom);
    });

    it('normalizes custom function names to uppercase for lookup', () => {
      const custom = { name: 'double', minArgs: 1, maxArgs: 1, apply: () => 0 };
      const registry = createFormulaFunctionRegistry([custom]);
      expect(registry.get('DOUBLE')).to.equal(custom);
    });

    it('throws on reserved names', () => {
      const reserved = [
        'REF',
        'COLUMN',
        'ROW',
        'COLUMN_POSITION',
        'ROW_POSITION',
        'FIELD',
        'RANGE',
        'COLUMN_VALUES',
        'TRUE',
        'FALSE',
      ];
      for (const name of reserved) {
        expect(() =>
          createFormulaFunctionRegistry([{ name, minArgs: 0, maxArgs: 0, apply: () => 0 }]),
        ).to.throw('reserved by the formula syntax');
      }
    });

    it('throws on reserved names regardless of case', () => {
      expect(() =>
        createFormulaFunctionRegistry([{ name: 'ref', minArgs: 0, maxArgs: 0, apply: () => 0 }]),
      ).to.throw('reserved by the formula syntax');
    });

    it('throws on names the parser can never produce as a call', () => {
      for (const name of ['MY FUNC', '2X', 'A-B', '']) {
        expect(() =>
          createFormulaFunctionRegistry([{ name, minArgs: 0, maxArgs: 0, apply: () => 0 }]),
        ).to.throw('is not a valid formula function name');
      }
      // Lookup is case-insensitive, so lowercase and underscore names are reachable.
      for (const name of ['double', '_x1']) {
        expect(() =>
          createFormulaFunctionRegistry([{ name, minArgs: 0, maxArgs: 0, apply: () => 0 }]),
        ).not.to.throw();
      }
    });

    it('declares no volatile built-ins', () => {
      for (const definition of FORMULA_BUILT_IN_FUNCTIONS) {
        expect(definition.volatile ?? false).to.equal(false);
      }
    });
  });
});
