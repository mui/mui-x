import type { GridInitialState } from '@mui/x-data-grid';
import { type CommandHandler, type ExecutorContext, invalid, ok } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

type Handler<P> = CommandHandler<StudioHostAdapter, StudioStateDocument, P>;
type Ctx = ExecutorContext<StudioHostAdapter, StudioStateDocument>;

interface AddViewParams {
  dataSourceId?: string;
  label?: string;
  type?: string;
  initialState?: GridInitialState;
  params?: Record<string, unknown>;
}

interface SelectViewParams {
  sheetId: string;
}

interface RenameViewParams {
  sheetId: string;
  label: string;
}

interface DuplicateViewParams {
  sheetId: string;
}

interface DeleteViewParams {
  sheetId: string;
}

interface MoveViewParams {
  sheetId: string;
  delta: number;
}

interface UpdateViewParams {
  sheetId: string;
  patch: {
    dataSourceId?: string;
    type?: string;
    initialState?: GridInitialState;
    params?: Record<string, unknown>;
  };
}

function findSheet(ctx: Ctx, sheetId: string) {
  return ctx.adapter.api.stateApi.sheets.find((sheet) => sheet.id === sheetId);
}

export const studioAddView: Handler<AddViewParams> = {
  type: 'studio.addSheet',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'sheet',
  validate: (params, ctx) => {
    if (params?.dataSourceId != null) {
      const exists = ctx.adapter.api.dataSources.some((d) => d.id === params.dataSourceId);
      if (!exists) {
        return invalid(`studio.addSheet: unknown dataSourceId '${params.dataSourceId}'`);
      }
    }
    return ok();
  },
  run: (params, ctx) => {
    const created = ctx.adapter.api.stateApi.addSheet({
      dataSourceId: params?.dataSourceId,
      label: params?.label,
      type: params?.type,
      initialState: params?.initialState,
      params: params?.params,
    });
    return created ?? undefined;
  },
};

export const studioSelectView: Handler<SelectViewParams> = {
  type: 'studio.selectSheet',
  namespace: 'studio',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.sheetId !== 'string') {
      return invalid('studio.selectSheet requires { sheetId }');
    }
    if (!findSheet(ctx, params.sheetId)) {
      return invalid(`studio.selectSheet: unknown sheetId '${params.sheetId}'`);
    }
    return ok();
  },
  run: ({ sheetId }, ctx) => {
    ctx.adapter.api.stateApi.selectSheet(sheetId);
  },
};

export const studioRenameView: Handler<RenameViewParams> = {
  type: 'studio.renameSheet',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'sheet',
  validate: (params, ctx) => {
    if (!params || typeof params.sheetId !== 'string' || typeof params.label !== 'string') {
      return invalid('studio.renameSheet requires { sheetId, label }');
    }
    if (!findSheet(ctx, params.sheetId)) {
      return invalid(`studio.renameSheet: unknown sheetId '${params.sheetId}'`);
    }
    return ok();
  },
  run: ({ sheetId, label }, ctx) => {
    ctx.adapter.api.stateApi.renameSheet(sheetId, label);
  },
};

export const studioDuplicateView: Handler<DuplicateViewParams> = {
  type: 'studio.duplicateSheet',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'sheet',
  validate: (params, ctx) => {
    if (!params || typeof params.sheetId !== 'string') {
      return invalid('studio.duplicateSheet requires { sheetId }');
    }
    if (!findSheet(ctx, params.sheetId)) {
      return invalid(`studio.duplicateSheet: unknown sheetId '${params.sheetId}'`);
    }
    return ok();
  },
  run: ({ sheetId }, ctx) => {
    const copy = ctx.adapter.api.stateApi.duplicateSheet(sheetId);
    return copy ?? undefined;
  },
};

export const studioDeleteView: Handler<DeleteViewParams> = {
  type: 'studio.deleteSheet',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'sheet',
  validate: (params, ctx) => {
    if (!params || typeof params.sheetId !== 'string') {
      return invalid('studio.deleteSheet requires { sheetId }');
    }
    if (!findSheet(ctx, params.sheetId)) {
      return invalid(`studio.deleteSheet: unknown sheetId '${params.sheetId}'`);
    }
    return ok();
  },
  run: ({ sheetId }, ctx) => {
    ctx.adapter.api.stateApi.deleteSheet(sheetId);
  },
};

export const studioMoveView: Handler<MoveViewParams> = {
  type: 'studio.moveSheet',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'sheet',
  validate: (params, ctx) => {
    if (!params || typeof params.sheetId !== 'string' || typeof params.delta !== 'number') {
      return invalid('studio.moveSheet requires { sheetId, delta }');
    }
    if (!Number.isInteger(params.delta)) {
      return invalid('studio.moveSheet: delta must be an integer');
    }
    if (!findSheet(ctx, params.sheetId)) {
      return invalid(`studio.moveSheet: unknown sheetId '${params.sheetId}'`);
    }
    return ok();
  },
  run: ({ sheetId, delta }, ctx) => {
    ctx.adapter.api.stateApi.moveSheet(sheetId, delta);
  },
};

export const studioUpdateView: Handler<UpdateViewParams> = {
  type: 'studio.updateSheet',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'sheet',
  validate: (params, ctx) => {
    if (!params || typeof params.sheetId !== 'string' || !params.patch) {
      return invalid('studio.updateSheet requires { sheetId, patch }');
    }
    if (!findSheet(ctx, params.sheetId)) {
      return invalid(`studio.updateSheet: unknown sheetId '${params.sheetId}'`);
    }
    if (params.patch.dataSourceId !== undefined) {
      if (typeof params.patch.dataSourceId !== 'string') {
        return invalid('studio.updateSheet: patch.dataSourceId must be a string');
      }
      const exists = ctx.adapter.api.dataSources.some((d) => d.id === params.patch.dataSourceId);
      if (!exists) {
        return invalid(
          `studio.updateSheet: unknown patch.dataSourceId '${params.patch.dataSourceId}'`,
        );
      }
    }
    return ok();
  },
  run: ({ sheetId, patch }, ctx) => {
    ctx.adapter.api.stateApi.updateSheet(sheetId, patch);
  },
};

export const studioViewCommands: Array<CommandHandler<StudioHostAdapter, StudioStateDocument>> = [
  studioAddView,
  studioSelectView,
  studioRenameView,
  studioDuplicateView,
  studioDeleteView,
  studioMoveView,
  studioUpdateView,
];
