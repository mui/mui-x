import type { CommandHandler } from '../types';

interface CsvParams {
  fileName?: string;
  delimiter?: string;
  utf8WithBom?: boolean;
  includeHeaders?: boolean;
  includeColumnGroupsHeaders?: boolean;
  allColumns?: boolean;
  fields?: string[];
}

interface ExcelParams {
  fileName?: string;
  includeHeaders?: boolean;
  includeColumnGroupsHeaders?: boolean;
  allColumns?: boolean;
  fields?: string[];
}

interface PrintParams {
  fileName?: string;
  includeHeaders?: boolean;
  allColumns?: boolean;
  fields?: string[];
  hideToolbar?: boolean;
  hideFooter?: boolean;
  copyStyles?: boolean;
}

export const exportCsv: CommandHandler<CsvParams> = {
  type: 'export.csv',
  namespace: 'export',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'export',
  dependsOn: (_, ctx) => Array.from(ctx.appliedSlices),
  run: (params, ctx) => {
    ctx.apiRef.current.exportDataAsCsv((params ?? {}) as any);
  },
};

export const exportExcel: CommandHandler<ExcelParams> = {
  type: 'export.excel',
  namespace: 'export',
  tier: 3,
  plan: 'premium',
  guard: 'mutations',
  phase: 'export',
  dependsOn: (_, ctx) => Array.from(ctx.appliedSlices),
  run: (params, ctx) => {
    return (ctx.apiRef.current as any).exportDataAsExcel?.(params ?? {});
  },
};

export const exportPrint: CommandHandler<PrintParams> = {
  type: 'export.print',
  namespace: 'export',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'export',
  dependsOn: (_, ctx) => Array.from(ctx.appliedSlices),
  run: (params, ctx) => {
    ctx.apiRef.current.exportDataAsPrint((params ?? {}) as any);
  },
};

export const exportCommands: CommandHandler[] = [exportCsv, exportExcel, exportPrint];
