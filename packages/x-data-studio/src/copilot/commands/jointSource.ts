import { type CommandHandler, type ExecutorContext, invalid, ok } from '@mui/x-copilot';
import type { DataStudioJoinDefinition } from '../../models';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

type Handler<P> = CommandHandler<StudioHostAdapter, StudioStateDocument, P>;
type Ctx = ExecutorContext<StudioHostAdapter, StudioStateDocument>;

interface CreateJointSourceParams {
  label: string;
  definition: DataStudioJoinDefinition;
}
interface UpdateJointSourceParams {
  id: string;
  label: string;
  definition: DataStudioJoinDefinition;
}
interface DeleteJointSourceParams {
  id: string;
}

const JOIN_TYPES = new Set(['inner', 'left', 'right', 'full']);

/**
 * Shallow client-side validation of a join definition (the server validates it
 * fully at query time — same-connection tables, field existence, etc.). Here we
 * just fail fast on obviously-malformed definitions so the agent gets a clear
 * error instead of a runtime fetch failure.
 */
function validateDefinition(definition: unknown, ctx: Ctx, command: string) {
  if (!definition || typeof definition !== 'object') {
    return invalid(`${command}: requires a join definition`);
  }
  const def = definition as Partial<DataStudioJoinDefinition>;
  const sourceIds = new Set(ctx.adapter.api.dataSources.map((d) => d.id));
  if (typeof def.base !== 'string' || !sourceIds.has(def.base)) {
    return invalid(`${command}: unknown base data source '${String(def.base)}'`);
  }
  if (!Array.isArray(def.joins) || def.joins.length === 0) {
    return invalid(`${command}: requires at least one join`);
  }
  for (const join of def.joins) {
    if (!join || typeof join.sourceId !== 'string' || !sourceIds.has(join.sourceId)) {
      return invalid(`${command}: unknown joined data source '${String(join?.sourceId)}'`);
    }
    if (!JOIN_TYPES.has(join.type as string)) {
      return invalid(`${command}: invalid join type '${String(join?.type)}'`);
    }
    if (!Array.isArray(join.on) || join.on.length === 0) {
      return invalid(`${command}: each join needs at least one { leftField, rightField } pair`);
    }
  }
  if (!Array.isArray(def.columns) || def.columns.length === 0) {
    return invalid(`${command}: requires at least one output column`);
  }
  return ok();
}

export const studioCreateJointSource: Handler<CreateJointSourceParams> = {
  type: 'studio.createJointSource',
  namespace: 'studio',
  tier: 3,
  plan: 'premium',
  guard: 'jointSourceCrud',
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.label !== 'string' || params.label.trim() === '') {
      return invalid('studio.createJointSource requires { label, definition }');
    }
    return validateDefinition(params.definition, ctx, 'studio.createJointSource');
  },
  run: (params, ctx) => {
    const id = ctx.adapter.api.jointSources.create({
      label: params.label,
      definition: params.definition,
    });
    // Surface the new source so the user sees the result.
    ctx.adapter.api.stateApi.selectDataSource(id);
    return undefined;
  },
};

export const studioUpdateJointSource: Handler<UpdateJointSourceParams> = {
  type: 'studio.updateJointSource',
  namespace: 'studio',
  tier: 3,
  plan: 'premium',
  guard: 'jointSourceCrud',
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.id !== 'string' || typeof params.label !== 'string') {
      return invalid('studio.updateJointSource requires { id, label, definition }');
    }
    if (!ctx.adapter.api.jointSources.configs.some((config) => config.id === params.id)) {
      return invalid(`studio.updateJointSource: unknown joint source '${params.id}'`);
    }
    return validateDefinition(params.definition, ctx, 'studio.updateJointSource');
  },
  run: (params, ctx) => {
    ctx.adapter.api.jointSources.update(params.id, {
      label: params.label,
      definition: params.definition,
    });
  },
};

export const studioDeleteJointSource: Handler<DeleteJointSourceParams> = {
  type: 'studio.deleteJointSource',
  namespace: 'studio',
  tier: 3,
  plan: 'premium',
  guard: 'jointSourceCrud',
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.id !== 'string') {
      return invalid('studio.deleteJointSource requires { id }');
    }
    if (!ctx.adapter.api.jointSources.configs.some((config) => config.id === params.id)) {
      return invalid(`studio.deleteJointSource: unknown joint source '${params.id}'`);
    }
    return ok();
  },
  run: (params, ctx) => {
    ctx.adapter.api.jointSources.remove(params.id);
  },
};

export const studioJointSourceCommands: Array<
  CommandHandler<StudioHostAdapter, StudioStateDocument>
> = [studioCreateJointSource, studioUpdateJointSource, studioDeleteJointSource];
