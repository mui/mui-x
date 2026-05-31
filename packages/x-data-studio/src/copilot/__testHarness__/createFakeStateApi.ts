import type { GridInitialState } from '@mui/x-data-grid';
import type {
  DataStudioDataSource,
  DataStudioSheet,
} from '../../DataStudio/DataStudio.types';
import type { DataStudioStateApi } from '../../DataStudio/useDataStudioState';

/**
 * Recording fake `DataStudioStateApi` used by command/reconciler tests.
 * Mutates internal state so a single test can drive the agent and read back
 * the resulting `sheets` / active selection without rendering a real Studio.
 */
export interface FakeStudioState {
  api: DataStudioStateApi<any>;
  /** Direct read-access to the internal sheets list for assertions. */
  readonly sheets: DataStudioSheet[];
  /** All method invocations, in order, with their arguments. */
  readonly calls: Array<{ method: string; args: ReadonlyArray<unknown> }>;
}

export interface CreateFakeStateApiOptions {
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  initialSheets?: DataStudioSheet[];
  initialActiveDataSourceId?: string | null;
  initialActiveSheetId?: string | null;
}

let viewSeq = 0;
function nextViewId() {
  viewSeq += 1;
  return `fake-sheet-${viewSeq}`;
}

export function createFakeStateApi(options: CreateFakeStateApiOptions): FakeStudioState {
  const { dataSources, initialSheets = [], initialActiveDataSourceId = null, initialActiveSheetId = null } =
    options;

  const sheets: DataStudioSheet[] = initialSheets.slice();
  let activeDataSourceId: string = initialActiveDataSourceId ?? dataSources[0]?.id ?? '';
  let activeSheetId: string | null = initialActiveSheetId;
  const calls: Array<{ method: string; args: ReadonlyArray<unknown> }> = [];

  function record(method: string, args: ReadonlyArray<unknown>) {
    calls.push({ method, args });
  }

  const api: DataStudioStateApi<any> = {
    get activeDataSourceId() {
      return activeDataSourceId;
    },
    get activeSheetId() {
      return activeSheetId;
    },
    get activeDataSource() {
      return dataSources.find((d) => d.id === activeDataSourceId) ?? null;
    },
    get activeSheet() {
      return sheets.find((v) => v.id === activeSheetId) ?? null;
    },
    get sheets() {
      return sheets;
    },
    isComposing: false,
    startComposing() {
      record('startComposing', []);
    },
    cancelComposing() {
      record('cancelComposing', []);
    },
    selectDataSource(dataSourceId) {
      record('selectDataSource', [dataSourceId]);
      if (dataSources.some((d) => d.id === dataSourceId)) {
        activeDataSourceId = dataSourceId;
        activeSheetId = null;
      }
    },
    selectSheet(sheetId) {
      record('selectSheet', [sheetId]);
      const target = sheets.find((v) => v.id === sheetId);
      if (target && target.dataSourceId != null) {
        activeSheetId = sheetId;
        activeDataSourceId = target.dataSourceId;
      }
    },
    addSheet(input) {
      record('addSheet', [input]);
      const dataSourceId = input?.dataSourceId ?? activeDataSourceId;
      if (!dataSources.some((d) => d.id === dataSourceId)) {
        return null;
      }
      const newSheet: DataStudioSheet = {
        id: nextViewId(),
        label: input?.label ?? `sheet-${sheets.length + 1}`,
        dataSourceId,
        ...(input?.initialState ? { initialState: input.initialState as GridInitialState } : {}),
      };
      sheets.push(newSheet);
      activeSheetId = newSheet.id;
      activeDataSourceId = dataSourceId;
      return newSheet;
    },
    updateSheet(sheetId, patch) {
      record('updateSheet', [sheetId, patch]);
      const idx = sheets.findIndex((v) => v.id === sheetId);
      if (idx === -1) {
        return;
      }
      const current = sheets[idx];
      sheets[idx] = {
        ...current,
        ...(patch.dataSourceId !== undefined ? { dataSourceId: patch.dataSourceId } : {}),
        ...(patch.initialState !== undefined ? { initialState: patch.initialState } : {}),
      };
    },
    renameSheet(sheetId, label) {
      record('renameSheet', [sheetId, label]);
      const idx = sheets.findIndex((v) => v.id === sheetId);
      if (idx !== -1) {
        sheets[idx] = { ...sheets[idx], label };
      }
    },
    duplicateSheet(sheetId) {
      record('duplicateSheet', [sheetId]);
      const idx = sheets.findIndex((v) => v.id === sheetId);
      if (idx === -1) {
        return null;
      }
      const copy: DataStudioSheet = {
        ...sheets[idx],
        id: nextViewId(),
        label: `${sheets[idx].label} (copy)`,
      };
      sheets.splice(idx + 1, 0, copy);
      activeSheetId = copy.id;
      return copy;
    },
    deleteSheet(sheetId) {
      record('deleteSheet', [sheetId]);
      const idx = sheets.findIndex((v) => v.id === sheetId);
      if (idx !== -1) {
        sheets.splice(idx, 1);
        if (activeSheetId === sheetId) {
          activeSheetId = null;
        }
      }
    },
    moveSheet(sheetId, delta) {
      record('moveSheet', [sheetId, delta]);
      const idx = sheets.findIndex((v) => v.id === sheetId);
      if (idx === -1) {
        return;
      }
      const targetIdx = idx + delta;
      if (targetIdx < 0 || targetIdx >= sheets.length) {
        return;
      }
      const [moved] = sheets.splice(idx, 1);
      sheets.splice(targetIdx, 0, moved);
    },
    invalidateDataSource(dataSourceId) {
      record('invalidateDataSource', [dataSourceId]);
    },
    invalidateAll() {
      record('invalidateAll', []);
    },
    startSheetFromTemplate(templateId) {
      record('startSheetFromTemplate', [templateId]);
      return null;
    },
    async startSheetFromPrompt(prompt) {
      record('startSheetFromPrompt', [prompt]);
      return null;
    },
  };

  return {
    api,
    get sheets() {
      return sheets;
    },
    get calls() {
      return calls;
    },
  };
}
