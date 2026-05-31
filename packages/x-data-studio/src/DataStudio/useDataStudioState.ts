'use client';
import * as React from 'react';
import type { GridInitialState, GridValidRowModel } from '@mui/x-data-grid';
import type {
  DataStudioDataSource,
  DataStudioProps,
  DataStudioSheet,
  DataStudioSheetTemplate,
} from './DataStudio.types';
import type { DataStudioSessionCache } from './sessionCache';

export interface DataStudioStateApi<R extends GridValidRowModel = any> {
  activeDataSourceId: string;
  activeSheetId: string | null;
  activeDataSource: DataStudioDataSource<R> | null;
  activeSheet: DataStudioSheet | null;
  sheets: DataStudioSheet[];
  /**
   * Whether the Composer (prompt + template picker) is shown as the
   * "create a new Sheet" screen. Toggled by [[startComposing]] /
   * [[cancelComposing]]; cleared automatically when a Sheet or Data Source
   * becomes active.
   */
  isComposing: boolean;
  /**
   * Open the Composer to create a new Sheet (prompt + template picker) instead
   * of immediately appending a default grid Sheet. Wired to the "Add new sheet"
   * affordances in the sidebar and tab bar.
   */
  startComposing: () => void;
  /** Dismiss the Composer without creating a Sheet. */
  cancelComposing: () => void;
  selectDataSource: (dataSourceId: string) => void;
  selectSheet: (sheetId: string) => void;
  addSheet: (input?: {
    /**
     * Data source binding:
     *   - `undefined` (default): bind to the active data source.
     *   - `string`: bind to the given data source id (returns `null` if unknown).
     *   - `null`: free-form Sheet — no data source binding (used by the
     *     Spreadsheet template).
     */
    dataSourceId?: string | null;
    label?: string;
    initialState?: GridInitialState;
    type?: string;
    params?: Record<string, unknown>;
  }) => DataStudioSheet | null;
  updateSheet: (
    sheetId: string,
    patch: {
      dataSourceId?: string | null;
      initialState?: GridInitialState;
      type?: string;
      params?: Record<string, unknown>;
    },
  ) => void;
  renameSheet: (sheetId: string, label: string) => void;
  duplicateSheet: (sheetId: string) => DataStudioSheet | null;
  deleteSheet: (sheetId: string) => void;
  moveSheet: (sheetId: string, delta: number) => void;
  /**
   * Build a sheet from a registered template and append it.
   * The active Data Source is forwarded to `template.build` so templates can
   * bind the new sheet to it.
   * @param {string} templateId Registry id of the template.
   * @returns {DataStudioSheet | null} The new sheet, or `null` if the
   *   template id is unknown or the build returned a sheet whose
   *   `dataSourceId` doesn't match any registered Data Source.
   */
  startSheetFromTemplate: (templateId: string) => DataStudioSheet | null;
  /**
   * Hook for the Composer's AI prompt input. Resolves to the new sheet when
   * the agent successfully constructed one, or `null` when no copilot
   * adapter is wired or the prompt was rejected.
   *
   * v1 ships a placeholder: the prompt is dropped and the method resolves
   * to `null`. Feature 06+ will route the prompt through `copilotChatAdapter`
   * to build a `DataStudioSheet` from JSON the agent returns.
   * @param {string} prompt The user's prompt text.
   * @returns {Promise<DataStudioSheet | null>} The new sheet, or `null`.
   */
  startSheetFromPrompt: (prompt: string) => Promise<DataStudioSheet | null>;
  /**
   * Drop every cached page for the given dataSource.
   * No-op unless `cacheStrategy === 'shared'`.
   * @param {string} dataSourceId The dataSource id to invalidate.
   */
  invalidateDataSource: (dataSourceId: string) => void;
  /**
   * Drop every cached page across all dataSources in this `<DataStudio>`.
   * No-op unless `cacheStrategy === 'shared'`.
   */
  invalidateAll: () => void;
}

function getDataSourceById<R extends GridValidRowModel>(
  dataSources: readonly DataStudioDataSource<R>[],
  dataSourceId: string | null | undefined,
) {
  if (dataSourceId == null) {
    return undefined;
  }
  return dataSources.find((dataSource) => dataSource.id === dataSourceId);
}

function getSheetById(sheets: readonly DataStudioSheet[], sheetId: string | null | undefined) {
  if (sheetId == null) {
    return undefined;
  }
  return sheets.find((sheet) => sheet.id === sheetId);
}

let nextSheetSeq = 0;

function createSheetId() {
  nextSheetSeq += 1;
  return `sheet-${Date.now().toString(36)}-${nextSheetSeq.toString(36)}`;
}

function getDefaultSheetLabel(sheets: readonly DataStudioSheet[]) {
  let index = sheets.length + 1;
  const existing = new Set(sheets.map((sheet) => String(sheet.label)));
  while (existing.has(`Sheet ${index}`)) {
    index += 1;
  }
  return `Sheet ${index}`;
}

export function useDataStudioState<R extends GridValidRowModel = any>(
  props: Pick<
    DataStudioProps<R>,
    | 'dataSources'
    | 'activeDataSourceId'
    | 'initialDataSourceId'
    | 'onActiveDataSourceChange'
    | 'sheets'
    | 'defaultSheets'
    | 'onSheetsChange'
    | 'activeSheetId'
    | 'initialActiveSheetId'
    | 'onActiveSheetChange'
  > & {
    /**
     * The resolved (built-in + consumer override) Composer templates. Already
     * flattened to an array by `<DataStudio>`; the `Overridable` prop shape is
     * resolved upstream.
     */
    sheetTemplates?: ReadonlyArray<DataStudioSheetTemplate>;
    sessionCache?: DataStudioSessionCache | null;
    /**
     * One-shot loader called on mount when `sheets` is uncontrolled. Returning
     * a non-null array replaces the seeded uncontrolled sheets without firing
     * `onSheetsChange` (it's a hydration, not a user action).
     * @returns {DataStudioSheet[] | null} The persisted sheets to hydrate, or
     *   `null` to keep the initial `defaultSheets`.
     */
    hydrateSheets?: () => DataStudioSheet[] | null;
  },
): DataStudioStateApi<R> {
  const {
    dataSources,
    activeDataSourceId: activeDataSourceIdProp,
    initialDataSourceId,
    onActiveDataSourceChange,
    sheets: sheetsProp,
    defaultSheets,
    onSheetsChange,
    activeSheetId: activeSheetIdProp,
    initialActiveSheetId,
    onActiveSheetChange,
    sheetTemplates,
    sessionCache,
    hydrateSheets,
  } = props;

  const isDataSourceControlled = activeDataSourceIdProp !== undefined;
  const isSheetsControlled = sheetsProp !== undefined;
  const isActiveSheetControlled = activeSheetIdProp !== undefined;

  const [uncontrolledDataSourceId, setUncontrolledDataSourceId] = React.useState(
    () => initialDataSourceId ?? dataSources[0]?.id ?? '',
  );
  const [uncontrolledSheets, setUncontrolledSheets] = React.useState<DataStudioSheet[]>(
    () => defaultSheets ?? [],
  );
  const [uncontrolledActiveSheetId, setUncontrolledActiveSheetId] = React.useState<string | null>(
    () => initialActiveSheetId ?? null,
  );
  const [isComposing, setIsComposing] = React.useState(false);

  const startComposing = React.useCallback(() => setIsComposing(true), []);
  const cancelComposing = React.useCallback(() => setIsComposing(false), []);

  const sheets = isSheetsControlled ? sheetsProp! : uncontrolledSheets;

  const requestedActiveSheetId = isActiveSheetControlled
    ? (activeSheetIdProp ?? null)
    : uncontrolledActiveSheetId;
  const activeSheet = getSheetById(sheets, requestedActiveSheetId) ?? null;
  const activeSheetId = activeSheet?.id ?? null;

  const requestedDataSourceId = isDataSourceControlled
    ? activeDataSourceIdProp
    : (activeSheet?.dataSourceId ?? uncontrolledDataSourceId);
  const activeDataSource =
    getDataSourceById(dataSources, requestedDataSourceId) ?? dataSources[0] ?? null;
  const activeDataSourceId = activeDataSource?.id ?? '';

  const selectDataSource = React.useCallback(
    (dataSourceId: string) => {
      const nextDataSource = getDataSourceById(dataSources, dataSourceId);
      if (!nextDataSource) {
        return;
      }
      setIsComposing(false);
      if (!isDataSourceControlled) {
        setUncontrolledDataSourceId(dataSourceId);
      }
      if (!isActiveSheetControlled) {
        setUncontrolledActiveSheetId(null);
      }
      onActiveDataSourceChange?.(dataSourceId, nextDataSource);
      onActiveSheetChange?.(null, null);
    },
    [
      dataSources,
      isDataSourceControlled,
      isActiveSheetControlled,
      onActiveDataSourceChange,
      onActiveSheetChange,
    ],
  );

  const selectSheet = React.useCallback(
    (sheetId: string) => {
      const nextSheet = getSheetById(sheets, sheetId);
      if (!nextSheet) {
        return;
      }
      setIsComposing(false);
      const nextDataSource =
        nextSheet.dataSourceId != null
          ? getDataSourceById(dataSources, nextSheet.dataSourceId)
          : undefined;
      if (!isActiveSheetControlled) {
        setUncontrolledActiveSheetId(sheetId);
      }
      if (!isDataSourceControlled && nextDataSource) {
        setUncontrolledDataSourceId(nextDataSource.id);
      }
      onActiveSheetChange?.(sheetId, nextSheet);
      if (nextDataSource) {
        onActiveDataSourceChange?.(nextDataSource.id, nextDataSource);
      }
    },
    [
      dataSources,
      sheets,
      isActiveSheetControlled,
      isDataSourceControlled,
      onActiveSheetChange,
      onActiveDataSourceChange,
    ],
  );

  const hasHydratedSheetsRef = React.useRef(false);
  React.useEffect(() => {
    if (hasHydratedSheetsRef.current || isSheetsControlled || !hydrateSheets) {
      return;
    }
    hasHydratedSheetsRef.current = true;
    const hydrated = hydrateSheets();
    if (hydrated == null) {
      return;
    }
    setUncontrolledSheets(hydrated);
  }, [isSheetsControlled, hydrateSheets]);

  const commitSheets = React.useCallback(
    (nextSheets: DataStudioSheet[]) => {
      if (!isSheetsControlled) {
        setUncontrolledSheets(nextSheets);
      }
      onSheetsChange?.(nextSheets);
    },
    [isSheetsControlled, onSheetsChange],
  );

  const addSheet = React.useCallback<DataStudioStateApi<R>['addSheet']>(
    (input) => {
      // `null` is the explicit "free-form" signal. `undefined` falls back to
      // the active data source. Otherwise we look up the requested id.
      const isFreeForm = input !== undefined && input.dataSourceId === null;
      const requestedDataSourceId = isFreeForm
        ? null
        : (input?.dataSourceId ?? activeDataSourceId);
      const nextDataSource = isFreeForm
        ? null
        : (getDataSourceById(dataSources, requestedDataSourceId) ?? null);
      if (!isFreeForm && !nextDataSource) {
        return null;
      }
      const label = input?.label ?? getDefaultSheetLabel(sheets);
      const newSheet: DataStudioSheet = {
        id: createSheetId(),
        label,
        dataSourceId: nextDataSource ? nextDataSource.id : null,
        ...(input?.initialState ? { initialState: input.initialState } : {}),
        ...(input?.type ? { type: input.type } : {}),
        ...(input?.params ? { params: input.params } : {}),
      };
      const nextSheets = [...sheets, newSheet];
      commitSheets(nextSheets);
      setIsComposing(false);
      if (!isActiveSheetControlled) {
        setUncontrolledActiveSheetId(newSheet.id);
      }
      if (nextDataSource && !isDataSourceControlled) {
        setUncontrolledDataSourceId(nextDataSource.id);
      }
      onActiveSheetChange?.(newSheet.id, newSheet);
      if (nextDataSource) {
        onActiveDataSourceChange?.(nextDataSource.id, nextDataSource);
      }
      return newSheet;
    },
    [
      activeDataSourceId,
      dataSources,
      sheets,
      commitSheets,
      isActiveSheetControlled,
      isDataSourceControlled,
      onActiveSheetChange,
      onActiveDataSourceChange,
    ],
  );

  const updateSheet = React.useCallback<DataStudioStateApi<R>['updateSheet']>(
    (sheetId, patch) => {
      const index = sheets.findIndex((sheet) => sheet.id === sheetId);
      if (index === -1) {
        return;
      }
      const current = sheets[index];
      const nextDataSourceId =
        patch.dataSourceId !== undefined ? patch.dataSourceId : current.dataSourceId;
      const hasDataSourceChange =
        patch.dataSourceId !== undefined && patch.dataSourceId !== current.dataSourceId;
      const hasInitialStateChange = patch.initialState !== undefined;
      const hasTypeChange = patch.type !== undefined && patch.type !== current.type;
      const hasParamsChange = patch.params !== undefined;
      if (!hasDataSourceChange && !hasInitialStateChange && !hasTypeChange && !hasParamsChange) {
        return;
      }
      const nextInitialState = hasInitialStateChange ? patch.initialState : current.initialState;
      const nextSheet: DataStudioSheet = {
        ...current,
        dataSourceId: nextDataSourceId,
        ...(nextInitialState === undefined
          ? { initialState: undefined }
          : { initialState: nextInitialState }),
        ...(hasTypeChange ? { type: patch.type } : {}),
        ...(hasParamsChange ? { params: patch.params } : {}),
      };
      const nextSheets = sheets.slice();
      nextSheets[index] = nextSheet;
      commitSheets(nextSheets);
      if (hasDataSourceChange && nextDataSourceId != null) {
        const nextDataSource = getDataSourceById(dataSources, nextDataSourceId);
        if (nextDataSource) {
          if (!isDataSourceControlled && activeSheetId === sheetId) {
            setUncontrolledDataSourceId(nextDataSource.id);
          }
          if (activeSheetId === sheetId) {
            onActiveDataSourceChange?.(nextDataSource.id, nextDataSource);
          }
        }
      }
    },
    [
      sheets,
      dataSources,
      commitSheets,
      activeSheetId,
      isDataSourceControlled,
      onActiveDataSourceChange,
    ],
  );

  const renameSheet = React.useCallback(
    (sheetId: string, label: string) => {
      let didChange = false;
      const nextSheets = sheets.map((sheet) => {
        if (sheet.id !== sheetId || sheet.label === label) {
          return sheet;
        }
        didChange = true;
        return { ...sheet, label };
      });
      if (!didChange) {
        return;
      }
      commitSheets(nextSheets);
    },
    [sheets, commitSheets],
  );

  const duplicateSheet = React.useCallback<DataStudioStateApi<R>['duplicateSheet']>(
    (sheetId) => {
      const index = sheets.findIndex((sheet) => sheet.id === sheetId);
      if (index === -1) {
        return null;
      }
      const source = sheets[index];
      const copy: DataStudioSheet = {
        ...source,
        id: createSheetId(),
        label: `${source.label} (copy)`,
      };
      const nextSheets = [...sheets.slice(0, index + 1), copy, ...sheets.slice(index + 1)];
      commitSheets(nextSheets);
      if (!isActiveSheetControlled) {
        setUncontrolledActiveSheetId(copy.id);
      }
      onActiveSheetChange?.(copy.id, copy);
      return copy;
    },
    [sheets, commitSheets, isActiveSheetControlled, onActiveSheetChange],
  );

  const deleteSheet = React.useCallback(
    (sheetId: string) => {
      const index = sheets.findIndex((sheet) => sheet.id === sheetId);
      if (index === -1) {
        return;
      }
      const nextSheets = sheets.filter((sheet) => sheet.id !== sheetId);
      commitSheets(nextSheets);
      if (activeSheetId === sheetId) {
        if (!isActiveSheetControlled) {
          setUncontrolledActiveSheetId(null);
        }
        onActiveSheetChange?.(null, null);
      }
    },
    [sheets, activeSheetId, commitSheets, isActiveSheetControlled, onActiveSheetChange],
  );

  const moveSheet = React.useCallback(
    (sheetId: string, delta: number) => {
      const index = sheets.findIndex((sheet) => sheet.id === sheetId);
      if (index === -1) {
        return;
      }
      const targetIndex = index + delta;
      if (targetIndex < 0 || targetIndex >= sheets.length) {
        return;
      }
      const nextSheets = sheets.slice();
      const [moved] = nextSheets.splice(index, 1);
      nextSheets.splice(targetIndex, 0, moved);
      commitSheets(nextSheets);
    },
    [sheets, commitSheets],
  );

  const startSheetFromTemplate = React.useCallback<
    DataStudioStateApi<R>['startSheetFromTemplate']
  >(
    (templateId) => {
      const template = (sheetTemplates ?? []).find(
        (candidate: DataStudioSheetTemplate) => candidate.id === templateId,
      );
      if (!template) {
        return null;
      }
      const built = template.build({ dataSourceId: activeDataSourceId || null });
      // The template may return any subset of sheet fields; everything we
      // need flows through addSheet, which synthesizes the id + default label.
      // `dataSourceId: null` is preserved explicitly so addSheet treats the
      // result as a free-form Sheet (no data source binding).
      return addSheet({
        dataSourceId: built.dataSourceId === undefined ? undefined : built.dataSourceId,
        label: typeof built.label === 'string' ? built.label : template.label,
        initialState: built.initialState,
        type: built.type,
        params: built.params,
      });
    },
    [sheetTemplates, addSheet, activeDataSourceId],
  );

  const startSheetFromPrompt = React.useCallback<
    DataStudioStateApi<R>['startSheetFromPrompt']
  >(
    // v1 stub: the Composer disables the input unless a copilot adapter is
    // wired, so this only runs in tests / programmatic usage. Returning null
    // keeps the contract honest until the copilot bridge lands.
    async () => null,
    [],
  );

  const invalidateDataSource = React.useCallback(
    (dataSourceId: string) => {
      sessionCache?.invalidateDataSource(dataSourceId);
    },
    [sessionCache],
  );

  const invalidateAll = React.useCallback(() => {
    sessionCache?.invalidateAll();
  }, [sessionCache]);

  return {
    activeDataSourceId,
    activeSheetId,
    activeDataSource,
    activeSheet,
    sheets,
    isComposing,
    startComposing,
    cancelComposing,
    selectDataSource,
    selectSheet,
    addSheet,
    updateSheet,
    renameSheet,
    duplicateSheet,
    deleteSheet,
    moveSheet,
    startSheetFromTemplate,
    startSheetFromPrompt,
    invalidateDataSource,
    invalidateAll,
  };
}
