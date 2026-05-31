import {
  buildCommandRegistry,
  buildPatchRegistry,
  makeExecutor,
  type Executor,
} from '@mui/x-copilot';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
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
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  initialSheets?: any[];
  initialActiveDataSourceId?: string;
  initialActiveSheetId?: string | null;
  guardOverrides?: Partial<StudioGuards>;
}): TestExecutorContext {
  const fake = createFakeStateApi({
    dataSources: options.dataSources,
    initialSheets: options.initialSheets,
    initialActiveDataSourceId: options.initialActiveDataSourceId,
    initialActiveSheetId: options.initialActiveSheetId,
  });
  const guards = buildStudioGuards(options.guardOverrides);
  const host = createStudioHostAdapter({
    getStateApi: () => fake.api,
    getDataSources: () => options.dataSources,
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
