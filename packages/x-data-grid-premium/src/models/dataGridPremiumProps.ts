import type { RefObject } from '@mui/x-internals/types';
import type {
  GridCallbackDetails,
  GridValidRowModel,
  GridGroupNode,
  GridEventListener,
  GridGetRowsError,
  GridUpdateRowError,
  GridColDef,
  GridLocaleTextApi,
  GridEvents,
} from '@mui/x-data-grid-pro';
import type {
  GridExperimentalProFeatures,
  DataGridProPropsWithDefaultValue,
  DataGridProPropsWithoutDefaultValue,
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  DataGridPremiumSharedPropsWithDefaultValue,
} from '@mui/x-data-grid-pro/internals';
import type { GridRowGroupingModel } from '../hooks/features/rowGrouping';
import type {
  GridAggregationModel,
  GridAggregationFunction,
  GridAggregationFunctionDataSource,
  GridAggregationPosition,
} from '../hooks/features/aggregation';
import type { GridPremiumSlotsComponent } from './gridPremiumSlotsComponent';
import type { GridPremiumSlotProps } from './gridPremiumSlotProps';
import type { GridInitialStatePremium } from './gridStatePremium';
import type { GridApiPremium } from './gridApiPremium';
import type { GridCellSelectionModel } from '../hooks/features/cellSelection';
import type {
  GridPivotingColDefOverrides,
  PivotingColDefCallback,
  GridPivotModel,
} from '../hooks/features/pivoting/gridPivotingInterfaces';
import type {
  GridDataSourcePremium as GridDataSource,
  GridGetRowsParamsPremium as GridGetRowsParams,
} from '../hooks/features/dataSource/models';
import type {
  Conversation,
  PromptResponse,
  PromptSuggestion,
} from '../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import type { GridHistoryEventHandler } from '../hooks/features/history/gridHistoryInterfaces';

export interface GridExperimentalPremiumFeatures extends GridExperimentalProFeatures {
  charts?: boolean;
}

export interface DataGridPremiumPropsWithComplexDefaultValueBeforeProcessing extends Pick<
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  'localeText'
> {
  /**
   * Overridable components.
   */
  slots?: Partial<GridPremiumSlotsComponent>;
}

/**
 * The props users can give to the `DataGridPremiumProps` component.
 */
export interface DataGridPremiumProps<R extends GridValidRowModel = any> extends Omit<
  Partial<DataGridPremiumPropsWithDefaultValue<R>> &
    DataGridPremiumPropsWithComplexDefaultValueBeforeProcessing &
    DataGridPremiumPropsWithoutDefaultValue<R>,
  DataGridPremiumForcedPropsKey
> {}

export interface DataGridPremiumPropsWithComplexDefaultValueAfterProcessing extends Pick<
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  'localeText'
> {
  slots: GridPremiumSlotsComponent;
}

/**
 * The props of the Data Grid Premium component after the pre-processing phase.
 */
export interface DataGridPremiumProcessedProps
  extends
    DataGridPremiumPropsWithDefaultValue,
    DataGridPremiumPropsWithComplexDefaultValueAfterProcessing,
    DataGridPremiumPropsWithoutDefaultValue {}

export type DataGridPremiumForcedPropsKey = 'signature';

/**
 * The Data Grid Premium options with a default value overridable through props.
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface.
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`.
 */
export interface DataGridPremiumPropsWithDefaultValue<R extends GridValidRowModel = any>
  extends DataGridProPropsWithDefaultValue<R>, DataGridPremiumSharedPropsWithDefaultValue {
  /**
   * If `true`, aggregation is disabled.
   * @default false
   */
  disableAggregation: boolean;
  /**
   * If `true`, the row grouping is disabled.
   * @default false
   */
  disableRowGrouping: boolean;
  /**
   * If `single`, all the columns that are grouped are represented in the same grid column.
   * If `multiple`, each column that is grouped is represented in its own grid column.
   * @default 'single'
   */
  rowGroupingColumnMode: 'single' | 'multiple';
  /**
   * Aggregation functions available on the grid.
   * @default GRID_AGGREGATION_FUNCTIONS when `dataSource` is not provided, `{}` when `dataSource` is provided
   */
  aggregationFunctions:
    | Record<string, GridAggregationFunction>
    | Record<string, GridAggregationFunctionDataSource>;
  /**
   * Rows used to generate the aggregated value.
   * If `filtered`, the aggregated values are generated using only the rows currently passing the filtering process.
   * If `all`, the aggregated values are generated using all the rows.
   * @default "filtered"
   */
  aggregationRowsScope: 'filtered' | 'all';
  /**
   * Determines the position of an aggregated value.
   * @param {GridGroupNode} groupNode The current group.
   * @returns {GridAggregationPosition | null} Position of the aggregated value (if `null`, the group isn't aggregated).
   * @default (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline')
   */
  getAggregationPosition: (groupNode: GridGroupNode) => GridAggregationPosition | null;
  /**
   * If `true`, the clipboard paste is disabled.
   * @default false
   */
  disableClipboardPaste: boolean;
  /**
   * The function is used to split the pasted text into rows and cells.
   * @param {string} text The text pasted from the clipboard.
   * @param {string} delimiter The delimiter used to split the text. Default is the tab character and can be set with the `clipboardCopyCellDelimiter` prop.
   * @returns {string[][] | null} A 2D array of strings. The first dimension is the rows, the second dimension is the columns.
   * @default (pastedText, delimiter = '\t') => { const text = pastedText.replace(/\r?\n$/, ''); return text.split(/\r\n|\n|\r/).map((row) => row.split(delimiter)); }
   */
  splitClipboardPastedText: (text: string, delimiter: string) => string[][] | null;
  /**
   * If `true`, the pivoting feature is disabled.
   * @default false
   */
  disablePivoting: boolean;
  /**
   * If `true`, the AI Assistant is enabled.
   * @default false
   */
  aiAssistant: boolean;
  /**
   * If `true`, the charts integration feature is enabled.
   * @default false
   */
  chartsIntegration: boolean;
  /**
   * The maximum size of the history stack.
   * Set to 0 to disable the undo/redo feature.
   * @default 30
   */
  historyStackSize: number;
  /**
   * Map of grid events to their undo/redo handlers.
   * @default Handlers for `rowEditStop`, `cellEditStop` and `clipboardPasteEnd` events
   */
  historyEventHandlers: Record<GridEvents, GridHistoryEventHandler<any>>;
  /**
   * List of grid events after which the history stack items should be re-validated.
   * @default ['columnsChange', 'rowsSet', 'sortedRowsSet', 'filteredRowsSet', 'paginationModelChange']
   */
  historyValidationEvents: GridEvents[];
}

export interface DataGridPremiumPropsWithoutDefaultValue<
  R extends GridValidRowModel = any,
> extends Omit<
  DataGridProPropsWithoutDefaultValue<R>,
  'initialState' | 'apiRef' | 'dataSource' | 'onDataSourceError'
> {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
   */
  apiRef?: RefObject<GridApiPremium | null>;
  /**
   * The initial state of the DataGridPremium.
   * The data in it is set in the state on initialization but isn't controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStatePremium;
  /**
   * Overridable components props dynamically passed to the component at rendering.
   */
  slotProps?: GridPremiumSlotProps;
  /**
   * Set the row grouping model of the grid.
   */
  rowGroupingModel?: GridRowGroupingModel;
  /**
   * Callback fired when the row grouping model changes.
   * @param {GridRowGroupingModel} model Columns used as grouping criteria.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowGroupingModelChange?: (model: GridRowGroupingModel, details: GridCallbackDetails) => void;
  /**
   * Set the aggregation model of the grid.
   */
  aggregationModel?: GridAggregationModel;
  /**
   * Callback fired when the row grouping model changes.
   * @param {GridAggregationModel} model The aggregated columns.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onAggregationModelChange?: (model: GridAggregationModel, details: GridCallbackDetails) => void;
  /**
   * Set the cell selection model of the grid.
   */
  cellSelectionModel?: GridCellSelectionModel;
  /**
   * Callback fired when the selection state of one or multiple cells changes.
   * @param {GridCellSelectionModel} cellSelectionModel Object in the shape of [[GridCellSelectionModel]] containing the selected cells.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellSelectionModelChange?: (
    cellSelectionModel: GridCellSelectionModel,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when the state of the Excel export changes.
   * @param {string} inProgress Indicates if the task is in progress.
   */
  onExcelExportStateChange?: (inProgress: 'pending' | 'finished') => void;
  /**
   * Callback fired before the clipboard paste operation starts.
   * Use it to confirm or cancel the paste operation.
   * @param {object} params Params passed to the callback.
   * @param {string[][]} params.data The raw pasted data split by rows and cells.
   * @returns {Promise<any>} A promise that resolves to confirm the paste operation, and rejects to cancel it.
   */
  onBeforeClipboardPasteStart?: (params: { data: string[][] }) => Promise<any>;
  /**
   * Callback fired when the clipboard paste operation starts.
   */
  onClipboardPasteStart?: GridEventListener<'clipboardPasteStart'>;
  /**
   * Callback fired when the clipboard paste operation ends.
   */
  onClipboardPasteEnd?: GridEventListener<'clipboardPasteEnd'>;
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, then the feature is fully disabled, and neither property nor method calls will have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalPremiumFeatures>;
  /**
   * Data source object.
   */
  dataSource?: GridDataSource;
  /**
   * Callback fired when a data source request fails.
   * @param {GridGetRowsError | GridUpdateRowError} error The data source error object.
   */
  onDataSourceError?: (error: GridGetRowsError<GridGetRowsParams> | GridUpdateRowError) => void;
  /**
   * The pivot model of the grid.
   * Will be used to generate the pivot data.
   * In case of `pivotActive` being `false`, the pivot model is still used to populate the pivot panel.
   */
  pivotModel?: GridPivotModel;
  /**
   * Callback fired when the pivot model changes.
   * @param {GridPivotModel} pivotModel The new pivot model.
   */
  onPivotModelChange?: (pivotModel: GridPivotModel) => void;
  /**
   * If `true`, the data grid will show data in pivot mode using the `pivotModel`.
   * @default false
   */
  pivotActive?: boolean;
  /**
   * Callback fired when the pivot active state changes.
   * @param {boolean} isPivotActive Whether the data grid is in pivot mode.
   */
  onPivotActiveChange?: (isPivotActive: boolean) => void;
  /**
   * If `true`, the pivot side panel is visible.
   * @default false
   * @deprecated Use `initialState.sidebar.open` instead.
   */
  pivotPanelOpen?: boolean;
  /**
   * Callback fired when the pivot side panel open state changes.
   * @param {boolean} pivotPanelOpen Whether the pivot side panel is visible.
   * @deprecated Use the `sidebarOpen` and `sidebarClose` events or corresponding event handlers `onSidebarOpen()` and `onSidebarClose()` instead.
   */
  onPivotPanelOpenChange?: (pivotPanelOpen: boolean) => void;
  /**
   * Allows to generate derived columns from actual columns that will be used for pivoting.
   * Useful e.g. for date columns to generate year, quarter, month, etc.
   * @param {GridColDef} column The column to generate derived columns for.
   * @param {GridLocaleTextApi['getLocaleText']} getLocaleText The function to get the locale text.
   * @returns {GridColDef[] | undefined} The derived columns.
   * @default {defaultGetPivotDerivedColumns | undefined} Creates year and quarter columns for date columns if not in server side mode.
   */
  getPivotDerivedColumns?:
    | ((
        column: GridColDef,
        getLocaleText: GridLocaleTextApi['getLocaleText'],
      ) => GridColDef[] | undefined)
    | null;
  /**
   * The column definition overrides for the columns generated by the pivoting feature.
   * Pass either a partial column definition to apply the same overrides to all pivot columns, or a callback to apply different overrides to each pivot column.
   * For server-side pivoting, only the `PivotingColDefCallback` signature is supported, and the prop is required.
   * @type {Partial<GridPivotingColDefOverrides> | PivotingColDefCallback}
   * @default undefined
   * @throws {Error} If `undefined` and `dataSource` is provided.
   */
  pivotingColDef?: Partial<GridPivotingColDefOverrides> | PivotingColDefCallback;
  /**
   * The conversations with the AI Assistant.
   */
  aiAssistantConversations?: Conversation[];
  /**
   * Callback fired when the AI Assistant conversations change.
   * @param {Conversation[]} conversations The new AI Assistant conversations.
   */
  onAiAssistantConversationsChange?: (conversations: Conversation[]) => void;
  /**
   * The suggestions of the AI Assistant.
   */
  aiAssistantSuggestions?: PromptSuggestion[];
  /**
   * The index of the active AI Assistant conversation.
   */
  aiAssistantActiveConversationIndex?: number;
  /**
   * Callback fired when the AI Assistant active conversation index changes.
   * @param {number} aiAssistantActiveConversationIndex The new active conversation index.
   */
  onAiAssistantActiveConversationIndexChange?: (aiAssistantActiveConversationIndex: number) => void;
  /**
   * If `true`, the AI Assistant is allowed to pick up values from random cells from each column to build the prompt context.
   */
  allowAiAssistantDataSampling?: boolean;
  /**
   * The function to be used to process the prompt.
   * @param {string} prompt The prompt to be processed.
   * @param {string} promptContext The prompt context.
   * @param {string} conversationId The id of the conversation the prompt is part of. If not passed, prompt response will return a new conversation id that can be used to continue the newly started conversation.
   * @returns {Promise<PromptResponse>} The prompt response.
   */
  onPrompt?: (
    prompt: string,
    promptContext: string,
    conversationId?: string,
  ) => Promise<PromptResponse>;
  /**
   * Callback fired when the sidebar is closed.
   * @param {GridSidebarParams} params With all properties from [[GridSidebarParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSidebarClose?: GridEventListener<'sidebarClose'>;
  /**
   * Callback fired when the sidebar is opened.
   * @param {GridSidebarParams} params With all properties from [[GridSidebarParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSidebarOpen?: GridEventListener<'sidebarOpen'>;
  /**
   * The id of the active chart.
   */
  activeChartId?: string;
  /**
   * Callback fired when the active chart changes.
   * @param {string} activeChartId The new active chart id.
   */
  onActiveChartIdChange?: (activeChartId: string) => void;
  /**
   * Callback fired when an undo operation is executed.
   */
  onUndo?: GridEventListener<'undo'>;
  /**
   * Callback fired when a redo operation is executed.
   */
  onRedo?: GridEventListener<'redo'>;
}
