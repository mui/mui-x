import {
  buildCommandRegistry,
  buildPatchRegistry,
  makeExecutor,
  type Executor,
} from '@mui/x-copilot';
import type {
  DataStudioDataSource,
  DataStudioJointSourceConfig,
} from '../../DataStudio/DataStudio.types';
import { buildStudioGuards, type StudioGuards } from '../guards';
import { createStudioHostAdapter, type StudioHostAdapter } from '../studioHostAdapter';
import { studioCommandPack, studioReconcilerPack } from '../studioPacks';
import type { StudioStateDocument } from '../stateDocument';
import { createFakeStateApi, type FakeStudioState } from './createFakeStateApi';

export interface TestExecutorContext {
  fake: FakeStudioState;
  executor: Executor;
  host: StudioHostAdapter;
  /** Live view of the fake joint-source configs for assertions. */
  jointConfigs: DataStudioJointSourceConfig[];
}

export function createTestExecutor(options: {
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  initialSheets?: any[];
  initialActiveDataSourceId?: string;
  initialActiveSheetId?: string | null;
  initialJointConfigs?: DataStudioJointSourceConfig[];
  guardOverrides?: Partial<StudioGuards>;
}): TestExecutorContext {
  const fake = createFakeStateApi({
    dataSources: options.dataSources,
    initialSheets: options.initialSheets,
    initialActiveDataSourceId: options.initialActiveDataSourceId,
    initialActiveSheetId: options.initialActiveSheetId,
  });
  const jointConfigs: DataStudioJointSourceConfig[] = [...(options.initialJointConfigs ?? [])];
  let jointSeq = 0;
  const guards = buildStudioGuards(options.guardOverrides);
  const host = createStudioHostAdapter({
    getStateApi: () => fake.api,
    getDataSources: () => options.dataSources,
    getJointSources: () => ({
      configs: jointConfigs,
      create: (input) => {
        jointSeq += 1;
        const id = `joint-${jointSeq}`;
        jointConfigs.push({ id, label: input.label, definition: input.definition });
        return id;
      },
      update: (id, input) => {
        const idx = jointConfigs.findIndex((c) => c.id === id);
        if (idx !== -1) {
          jointConfigs[idx] = { id, label: input.label, definition: input.definition };
        }
      },
      remove: (id) => {
        const idx = jointConfigs.findIndex((c) => c.id === id);
        if (idx !== -1) {
          jointConfigs.splice(idx, 1);
        }
      },
    }),
    guards,
  });
  const commandRegistry = buildCommandRegistry<StudioHostAdapter, StudioStateDocument>(guards, [
    studioCommandPack,
  ]);
  const patchRegistry = buildPatchRegistry<StudioHostAdapter, StudioStateDocument>(guards, [
    studioReconcilerPack,
  ]);
  const executor = makeExecutor<StudioHostAdapter, StudioStateDocument>({
    adapter: host,
    guards,
    commandRegistry,
    patchRegistry,
  });
  return { fake, executor, host, jointConfigs };
}
