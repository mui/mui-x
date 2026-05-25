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

interface SelectDatasetParams {
  datasetId: string;
}

interface InvalidateDatasetParams {
  datasetId: string;
}

function findDataset(ctx: Ctx, datasetId: string) {
  return ctx.adapter.api.datasets.find((d) => d.id === datasetId);
}

export const studioSelectDataset: Handler<SelectDatasetParams> = {
  type: 'studio.selectDataset',
  namespace: 'studio',
  tier: 2,
  plan: 'community',
  guard: 'datasetSwitching',
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.datasetId !== 'string') {
      return invalid('studio.selectDataset requires { datasetId }');
    }
    if (!findDataset(ctx, params.datasetId)) {
      return invalid(`studio.selectDataset: unknown datasetId '${params.datasetId}'`);
    }
    return ok();
  },
  run: ({ datasetId }, ctx) => {
    ctx.adapter.api.stateApi.selectDataset(datasetId);
  },
};

export const studioInvalidateDataset: Handler<InvalidateDatasetParams> = {
  type: 'studio.invalidateDataset',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'datasetSwitching',
  phase: 'history',
  validate: (params, ctx) => {
    if (!params || typeof params.datasetId !== 'string') {
      return invalid('studio.invalidateDataset requires { datasetId }');
    }
    if (!findDataset(ctx, params.datasetId)) {
      return invalid(`studio.invalidateDataset: unknown datasetId '${params.datasetId}'`);
    }
    return ok();
  },
  run: ({ datasetId }, ctx) => {
    ctx.adapter.api.stateApi.invalidateDataset(datasetId);
  },
};

export const studioInvalidateAll: Handler<void> = {
  type: 'studio.invalidateAll',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'datasetSwitching',
  phase: 'history',
  run: (_params, ctx) => {
    ctx.adapter.api.stateApi.invalidateAll();
  },
};

export const studioDatasetCommands: Array<CommandHandler<StudioHostAdapter, StudioStateDocument>> = [
  studioSelectDataset,
  studioInvalidateDataset,
  studioInvalidateAll,
];
