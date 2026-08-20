import { GRID_FORMULA_FUNCTIONS, GridFormulaFunctionDefinition } from '@mui/x-data-grid-premium';

const MARGIN: GridFormulaFunctionDefinition = {
  name: 'MARGIN',
  minArgs: 2,
  maxArgs: 2,
  signature: 'MARGIN(revenue, cost)',
  description: 'Margin between two amounts, as a fraction of the first.',
  category: 'Playground',
  apply: ([revenue, cost], context) => {
    const r = context.coerce.toNumber(revenue);
    if (typeof r !== 'number') {
      return r;
    }
    const c = context.coerce.toNumber(cost);
    if (typeof c !== 'number') {
      return c;
    }
    if (r === 0) {
      return {
        kind: 'error',
        code: '#DIV/0!',
        message: 'MARGIN() requires a non-zero first amount.',
      };
    }
    return (r - c) / r;
  },
};

const TIER: GridFormulaFunctionDefinition = {
  name: 'TIER',
  minArgs: 3,
  maxArgs: 3,
  signature: 'TIER(value, gold_min, silver_min)',
  description: 'Labels a value Gold, Silver, or Bronze against two thresholds.',
  category: 'Playground',
  apply: ([value, goldMin, silverMin], context) => {
    const v = context.coerce.toNumber(value);
    if (typeof v !== 'number') {
      return v;
    }
    const gold = context.coerce.toNumber(goldMin);
    if (typeof gold !== 'number') {
      return gold;
    }
    const silver = context.coerce.toNumber(silverMin);
    if (typeof silver !== 'number') {
      return silver;
    }
    if (v >= gold) {
      return 'Gold';
    }
    return v >= silver ? 'Silver' : 'Bronze';
  },
};

// The `formulaFunctions` prop REPLACES the built-in set, so custom functions
// are registered by spreading `GRID_FORMULA_FUNCTIONS` — passing the custom
// entries alone would silently remove SUM, IF, and the rest.
export const PLAYGROUND_FUNCTIONS: Record<string, GridFormulaFunctionDefinition> = {
  ...GRID_FORMULA_FUNCTIONS,
  MARGIN,
  TIER,
};
