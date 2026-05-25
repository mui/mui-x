import { FormulaError, type FormulaNode, type FormulaValue } from './types';

export type EvalNode = (node: FormulaNode) => FormulaValue;

export interface EvalContext {
  mode: 'top' | 'perRow';
  evalChild: EvalNode;
  // Sets perRow mode + currentRowId for the duration of fn, restores prior mode after.
  withPerRow: <T>(rowId: number | string, fn: () => T) => T;
  rowIds: ReadonlyArray<number | string>;
}

export interface FunctionEntry {
  /** Aggregate functions consume the row set; only legal in `top` mode. */
  aggregate: boolean;
  call: (args: FormulaNode[], ctx: EvalContext) => FormulaValue;
}

function toNumber(v: FormulaValue, fnName: string): number {
  if (typeof v === 'number') {
    return v;
  }
  if (typeof v === 'boolean') {
    return v ? 1 : 0;
  }
  if (v == null) {
    return NaN;
  }
  if (typeof v === 'string') {
    const trimmed = v.trim();
    if (trimmed === '') {
      return NaN;
    }
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : NaN;
  }
  throw new FormulaError(`${fnName}: cannot coerce value to number`);
}

function isTruthy(v: FormulaValue): boolean {
  if (v == null) {
    return false;
  }
  if (typeof v === 'boolean') {
    return v;
  }
  if (typeof v === 'number') {
    return v !== 0 && !Number.isNaN(v);
  }
  return v !== '';
}

function assertArity(name: string, args: FormulaNode[], min: number, max = min): void {
  if (args.length < min || args.length > max) {
    const range = min === max ? `${min}` : `${min}–${max}`;
    throw new FormulaError(`${name}(...) takes ${range} arguments; got ${args.length}`);
  }
}

function assertTop(name: string, ctx: EvalContext): void {
  if (ctx.mode !== 'top') {
    throw new FormulaError(
      `${name}(...) is an aggregate and cannot appear inside another aggregate`,
    );
  }
}

function collectPerRow(
  ctx: EvalContext,
  argNode: FormulaNode,
  visit: (value: FormulaValue, rowId: number | string) => void,
): void {
  ctx.rowIds.forEach((rowId) => {
    ctx.withPerRow(rowId, () => {
      visit(ctx.evalChild(argNode), rowId);
    });
  });
}

const AGGREGATES: Record<string, FunctionEntry> = {
  SUM: {
    aggregate: true,
    call(args, ctx) {
      assertArity('SUM', args, 1);
      assertTop('SUM', ctx);
      let total = 0;
      collectPerRow(ctx, args[0], (value) => {
        const n = toNumber(value, 'SUM');
        if (Number.isFinite(n)) {
          total += n;
        }
      });
      return total;
    },
  },
  AVG: {
    aggregate: true,
    call(args, ctx) {
      assertArity('AVG', args, 1);
      assertTop('AVG', ctx);
      let total = 0;
      let count = 0;
      collectPerRow(ctx, args[0], (value) => {
        const n = toNumber(value, 'AVG');
        if (Number.isFinite(n)) {
          total += n;
          count += 1;
        }
      });
      return count === 0 ? null : total / count;
    },
  },
  MIN: {
    aggregate: true,
    call(args, ctx) {
      assertArity('MIN', args, 1);
      assertTop('MIN', ctx);
      let best: number | null = null;
      collectPerRow(ctx, args[0], (value) => {
        const n = toNumber(value, 'MIN');
        if (Number.isFinite(n)) {
          best = best === null || n < best ? n : best;
        }
      });
      return best;
    },
  },
  MAX: {
    aggregate: true,
    call(args, ctx) {
      assertArity('MAX', args, 1);
      assertTop('MAX', ctx);
      let best: number | null = null;
      collectPerRow(ctx, args[0], (value) => {
        const n = toNumber(value, 'MAX');
        if (Number.isFinite(n)) {
          best = best === null || n > best ? n : best;
        }
      });
      return best;
    },
  },
  COUNT: {
    aggregate: true,
    call(args, ctx) {
      assertArity('COUNT', args, 0, 1);
      assertTop('COUNT', ctx);
      if (args.length === 0) {
        return ctx.rowIds.length;
      }
      let count = 0;
      collectPerRow(ctx, args[0], (value) => {
        if (value != null && value !== '') {
          count += 1;
        }
      });
      return count;
    },
  },
  MEDIAN: {
    aggregate: true,
    call(args, ctx) {
      assertArity('MEDIAN', args, 1);
      assertTop('MEDIAN', ctx);
      const nums: number[] = [];
      collectPerRow(ctx, args[0], (value) => {
        const n = toNumber(value, 'MEDIAN');
        if (Number.isFinite(n)) {
          nums.push(n);
        }
      });
      if (nums.length === 0) {
        return null;
      }
      nums.sort((a, b) => a - b);
      const mid = Math.floor(nums.length / 2);
      return nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
    },
  },
  SUMIF: {
    aggregate: true,
    call(args, ctx) {
      assertArity('SUMIF', args, 2);
      assertTop('SUMIF', ctx);
      let total = 0;
      ctx.rowIds.forEach((rowId) => {
        ctx.withPerRow(rowId, () => {
          if (isTruthy(ctx.evalChild(args[0]))) {
            const n = toNumber(ctx.evalChild(args[1]), 'SUMIF');
            if (Number.isFinite(n)) {
              total += n;
            }
          }
        });
      });
      return total;
    },
  },
  COUNTIF: {
    aggregate: true,
    call(args, ctx) {
      assertArity('COUNTIF', args, 1);
      assertTop('COUNTIF', ctx);
      let count = 0;
      ctx.rowIds.forEach((rowId) => {
        ctx.withPerRow(rowId, () => {
          if (isTruthy(ctx.evalChild(args[0]))) {
            count += 1;
          }
        });
      });
      return count;
    },
  },
  AVERAGEIF: {
    aggregate: true,
    call(args, ctx) {
      assertArity('AVERAGEIF', args, 2);
      assertTop('AVERAGEIF', ctx);
      let total = 0;
      let count = 0;
      ctx.rowIds.forEach((rowId) => {
        ctx.withPerRow(rowId, () => {
          if (isTruthy(ctx.evalChild(args[0]))) {
            const n = toNumber(ctx.evalChild(args[1]), 'AVERAGEIF');
            if (Number.isFinite(n)) {
              total += n;
              count += 1;
            }
          }
        });
      });
      return count === 0 ? null : total / count;
    },
  },
};

const SCALARS: Record<string, FunctionEntry> = {
  IF: {
    aggregate: false,
    call(args, ctx) {
      assertArity('IF', args, 2, 3);
      if (isTruthy(ctx.evalChild(args[0]))) {
        return ctx.evalChild(args[1]);
      }
      return args.length === 3 ? ctx.evalChild(args[2]) : null;
    },
  },
  AND: {
    aggregate: false,
    call(args, ctx) {
      if (args.length === 0) {
        throw new FormulaError('AND(...) needs at least 1 argument');
      }
      for (const a of args) {
        if (!isTruthy(ctx.evalChild(a))) {
          return false;
        }
      }
      return true;
    },
  },
  OR: {
    aggregate: false,
    call(args, ctx) {
      if (args.length === 0) {
        throw new FormulaError('OR(...) needs at least 1 argument');
      }
      for (const a of args) {
        if (isTruthy(ctx.evalChild(a))) {
          return true;
        }
      }
      return false;
    },
  },
  NOT: {
    aggregate: false,
    call(args, ctx) {
      assertArity('NOT', args, 1);
      return !isTruthy(ctx.evalChild(args[0]));
    },
  },
  ROUND: {
    aggregate: false,
    call(args, ctx) {
      assertArity('ROUND', args, 1, 2);
      const x = toNumber(ctx.evalChild(args[0]), 'ROUND');
      if (!Number.isFinite(x)) {
        return null;
      }
      const digits = args.length === 2 ? Math.trunc(toNumber(ctx.evalChild(args[1]), 'ROUND')) : 0;
      const factor = 10 ** digits;
      return Math.round(x * factor) / factor;
    },
  },
  ABS: {
    aggregate: false,
    call(args, ctx) {
      assertArity('ABS', args, 1);
      const x = toNumber(ctx.evalChild(args[0]), 'ABS');
      return Number.isFinite(x) ? Math.abs(x) : null;
    },
  },
  CONCAT: {
    aggregate: false,
    call(args, ctx) {
      let out = '';
      for (const a of args) {
        const v = ctx.evalChild(a);
        out += v == null ? '' : String(v);
      }
      return out;
    },
  },
  UPPER: {
    aggregate: false,
    call(args, ctx) {
      assertArity('UPPER', args, 1);
      const v = ctx.evalChild(args[0]);
      return v == null ? '' : String(v).toUpperCase();
    },
  },
  LOWER: {
    aggregate: false,
    call(args, ctx) {
      assertArity('LOWER', args, 1);
      const v = ctx.evalChild(args[0]);
      return v == null ? '' : String(v).toLowerCase();
    },
  },
};

export const FORMULA_FUNCTIONS: Record<string, FunctionEntry> = { ...AGGREGATES, ...SCALARS };

export const FORMULA_FUNCTION_NAMES = Object.keys(FORMULA_FUNCTIONS);

export { toNumber, isTruthy };
