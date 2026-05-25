import type { GridInitialState } from '@mui/x-data-grid';
import {
  type CommandHandler,
  type ExecutorContext,
  invalid,
  ok,
} from '@mui/x-copilot';
import type {
  DataStudioChartConfig,
  DataStudioViewKind,
} from '../../DataStudio/DataStudio.types';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

type Handler<P> = CommandHandler<StudioHostAdapter, StudioStateDocument, P>;
type Ctx = ExecutorContext<StudioHostAdapter, StudioStateDocument>;

interface AddViewParams {
  datasetId?: string;
  label?: string;
  kind?: DataStudioViewKind;
  initialState?: GridInitialState;
  chartConfig?: DataStudioChartConfig;
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
    datasetId?: string;
    chartConfig?: DataStudioChartConfig;
    initialState?: GridInitialState;
  };
}

function findView(ctx: Ctx, viewId: string) {
  return ctx.adapter.api.stateApi.views.find((view) => view.id === viewId);
}

export const studioAddView: Handler<AddViewParams> = {
  type: 'studio.addView',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'view',
  validate: (params, ctx) => {
    if (params?.datasetId != null) {
      const exists = ctx.adapter.api.datasets.some((d) => d.id === params.datasetId);
      if (!exists) {
        return invalid(`studio.addView: unknown datasetId '${params.datasetId}'`);
      }
    }
    if (params?.kind != null && params.kind !== 'grid' && params.kind !== 'chart') {
      return invalid(`studio.addView: kind must be 'grid' or 'chart'`);
    }
    return ok();
  },
  run: (params, ctx) => {
    const created = ctx.adapter.api.stateApi.addView({
      datasetId: params?.datasetId,
      label: params?.label,
      kind: params?.kind,
      initialState: params?.initialState,
      chartConfig: params?.chartConfig,
    });
    return created ?? undefined;
  },
};

export const studioSelectView: Handler<SelectViewParams> = {
  type: 'studio.selectView',
  namespace: 'studio',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.viewId !== 'string') {
      return invalid('studio.selectView requires { viewId }');
    }
    if (!findView(ctx, params.viewId)) {
      return invalid(`studio.selectView: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId }, ctx) => {
    ctx.adapter.api.stateApi.selectView(viewId);
  },
};

export const studioRenameView: Handler<RenameViewParams> = {
  type: 'studio.renameView',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'view',
  validate: (params, ctx) => {
    if (!params || typeof params.viewId !== 'string' || typeof params.label !== 'string') {
      return invalid('studio.renameView requires { viewId, label }');
    }
    if (!findView(ctx, params.viewId)) {
      return invalid(`studio.renameView: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId, label }, ctx) => {
    ctx.adapter.api.stateApi.renameView(viewId, label);
  },
};

export const studioDuplicateView: Handler<DuplicateViewParams> = {
  type: 'studio.duplicateView',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'view',
  validate: (params, ctx) => {
    if (!params || typeof params.viewId !== 'string') {
      return invalid('studio.duplicateView requires { viewId }');
    }
    if (!findView(ctx, params.viewId)) {
      return invalid(`studio.duplicateView: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId }, ctx) => {
    const copy = ctx.adapter.api.stateApi.duplicateView(viewId);
    return copy ?? undefined;
  },
};

export const studioDeleteView: Handler<DeleteViewParams> = {
  type: 'studio.deleteView',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'view',
  validate: (params, ctx) => {
    if (!params || typeof params.viewId !== 'string') {
      return invalid('studio.deleteView requires { viewId }');
    }
    if (!findView(ctx, params.viewId)) {
      return invalid(`studio.deleteView: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId }, ctx) => {
    ctx.adapter.api.stateApi.deleteView(viewId);
  },
};

export const studioMoveView: Handler<MoveViewParams> = {
  type: 'studio.moveView',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'view',
  validate: (params, ctx) => {
    if (!params || typeof params.viewId !== 'string' || typeof params.delta !== 'number') {
      return invalid('studio.moveView requires { viewId, delta }');
    }
    if (!Number.isInteger(params.delta)) {
      return invalid('studio.moveView: delta must be an integer');
    }
    if (!findView(ctx, params.viewId)) {
      return invalid(`studio.moveView: unknown viewId '${params.viewId}'`);
    }
    return ok();
  },
  run: ({ viewId, delta }, ctx) => {
    ctx.adapter.api.stateApi.moveView(viewId, delta);
  },
};

export const studioUpdateView: Handler<UpdateViewParams> = {
  type: 'studio.updateView',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'viewCrud',
  phase: 'view',
  validate: (params, ctx) => {
    if (!params || typeof params.viewId !== 'string' || !params.patch) {
      return invalid('studio.updateView requires { viewId, patch }');
    }
    if (!findView(ctx, params.viewId)) {
      return invalid(`studio.updateView: unknown viewId '${params.viewId}'`);
    }
    if (params.patch.datasetId !== undefined) {
      if (typeof params.patch.datasetId !== 'string') {
        return invalid('studio.updateView: patch.datasetId must be a string');
      }
      const exists = ctx.adapter.api.datasets.some((d) => d.id === params.patch.datasetId);
      if (!exists) {
        return invalid(`studio.updateView: unknown patch.datasetId '${params.patch.datasetId}'`);
      }
    }
    return ok();
  },
  run: ({ viewId, patch }, ctx) => {
    ctx.adapter.api.stateApi.updateView(viewId, patch);
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
