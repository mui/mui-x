import {
  buildCommandRegistry,
  buildPatchRegistry,
  makeExecutor,
  type Executor,
} from '@mui/x-copilot';
import type { DataStudioDataset } from '../../DataStudio/DataStudio.types';
import { buildStudioGuards, type StudioGuards } from '../guards';
import { createStudioHostAdapter, type StudioHostAdapter } from '../studioHostAdapter';
import { studioCommandPack, studioReconcilerPack } from '../studioPacks';
import type { StudioStateDocument } from '../stateDocument';
import { createFakeStateApi, type FakeStudioState } from './createFakeStateApi';

export interface TestExecutorContext {
  fake: FakeStudioState;
  executor: Executor;
  host: StudioHostAdapter;
}

export function createTestExecutor(options: {
  datasets: ReadonlyArray<DataStudioDataset<any>>;
  initialViews?: any[];
  initialActiveDatasetId?: string;
  initialActiveViewId?: string | null;
  guardOverrides?: Partial<StudioGuards>;
}): TestExecutorContext {
  const fake = createFakeStateApi({
    datasets: options.datasets,
    initialViews: options.initialViews,
    initialActiveDatasetId: options.initialActiveDatasetId,
    initialActiveViewId: options.initialActiveViewId,
  });
  const guards = buildStudioGuards(options.guardOverrides);
  const host = createStudioHostAdapter({
    getStateApi: () => fake.api,
    getDatasets: () => options.datasets,
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
  return { fake, executor, host };
}
