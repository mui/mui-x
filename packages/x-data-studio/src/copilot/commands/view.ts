import type { GridInitialState } from '@mui/x-data-grid';
import {
  type CommandHandler,
  type ExecutorContext,
  invalid,
  ok,
} from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

type Handler<P> = CommandHandler<StudioHostAdapter, StudioStateDocument, P>;
type Ctx = ExecutorContext<StudioHostAdapter, StudioStateDocument>;

interface AddViewParams {
  dataSourceId?: string;
  label?: string;
  initialState?: GridInitialState;
}

interface SelectViewParams {
  viewId: string;
}

interface RenameViewParams {
  viewId: string;
  label: string;
}

interface DuplicateViewParams {
  viewId: string;
}

interface DeleteViewParams {
  viewId: string;
}

interface MoveViewParams {
  viewId: string;
  delta: number;
}

interface UpdateViewParams {
  viewId: string;
  patch: {
    dataSourceId?: string;
    initialState?: GridInitialState;
  };
}

function findSheet(ctx: Ctx, viewId: string) {
  return ctx.adapter.api.stateApi.sheets.find((sheet) => sheet.id === viewId);
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
      initialState: params?.initialState,
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
    if (!params || typeof params.viewId !== 'string') {
      return invalid('studio.selectSheet requires { viewId }');
    }
    if (!findSheet(ctx, params.viewId)) {
      return invalid(`studio.selectSheet: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId }, ctx) => {
    ctx.adapter.api.stateApi.selectSheet(viewId);
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
    if (!params || typeof params.viewId !== 'string' || typeof params.label !== 'string') {
      return invalid('studio.renameSheet requires { viewId, label }');
    }
    if (!findSheet(ctx, params.viewId)) {
      return invalid(`studio.renameSheet: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId, label }, ctx) => {
    ctx.adapter.api.stateApi.renameSheet(viewId, label);
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
    if (!params || typeof params.viewId !== 'string') {
      return invalid('studio.duplicateSheet requires { viewId }');
    }
    if (!findSheet(ctx, params.viewId)) {
      return invalid(`studio.duplicateSheet: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId }, ctx) => {
    const copy = ctx.adapter.api.stateApi.duplicateSheet(viewId);
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
    if (!params || typeof params.viewId !== 'string') {
      return invalid('studio.deleteSheet requires { viewId }');
    }
    if (!findSheet(ctx, params.viewId)) {
      return invalid(`studio.deleteSheet: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId }, ctx) => {
    ctx.adapter.api.stateApi.deleteSheet(viewId);
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
    if (!params || typeof params.viewId !== 'string' || typeof params.delta !== 'number') {
      return invalid('studio.moveSheet requires { viewId, delta }');
    }
    if (!Number.isInteger(params.delta)) {
      return invalid('studio.moveSheet: delta must be an integer');
    }
    if (!findSheet(ctx, params.viewId)) {
      return invalid(`studio.moveSheet: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId, delta }, ctx) => {
    ctx.adapter.api.stateApi.moveSheet(viewId, delta);
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
    if (!params || typeof params.viewId !== 'string' || !params.patch) {
      return invalid('studio.updateSheet requires { viewId, patch }');
    }
    if (!findSheet(ctx, params.viewId)) {
      return invalid(`studio.updateSheet: unknown viewId '${params.viewId}'`);
    }
    if (params.patch.dataSourceId !== undefined) {
      if (typeof params.patch.dataSourceId !== 'string') {
        return invalid('studio.updateSheet: patch.dataSourceId must be a string');
      }
      const exists = ctx.adapter.api.dataSources.some((d) => d.id === params.patch.dataSourceId);
      if (!exists) {
        return invalid(`studio.updateSheet: unknown patch.dataSourceId '${params.patch.dataSourceId}'`);
      }
    }
    return ok();
  },
  run: ({ viewId, patch }, ctx) => {
    ctx.adapter.api.stateApi.updateSheet(viewId, patch);
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
