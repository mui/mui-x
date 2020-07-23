interface LicenseDetails {
    orderNumber: string;
    expiryDate: Date;
}
declare const generateLicence: (details: LicenseDetails) => string;

declare class LicenseInfo {
    static key: string;
    static releaseInfo: string;
    static setLicenseKey(key: string): void;
    static setReleaseInfo(encodedReleaseInfo: string): void;
}

declare function showInvalidLicenseError(): void;
declare function showNotFoundLicenseError(): void;
declare function showExpiredLicenseError(): void;

declare enum LicenseStatus {
    NotFound = "NotFound",
    Invalid = "Invalid",
    Expired = "Expired",
    Valid = "Valid"
}

declare const generateReleaseInfo: () => string;
declare const verifyLicense: (releaseInfo: string, encodedLicense: string) => LicenseStatus;

declare function useLicenseVerifier(): LicenseStatus;

export { LicenseDetails, LicenseInfo, LicenseStatus, generateLicence, generateReleaseInfo, showExpiredLicenseError, showInvalidLicenseError, showNotFoundLicenseError, useLicenseVerifier, verifyLicense };
/// <reference types="node" />
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React, { ReactElement, RefObject, ElementType, MutableRefObject, HTMLAttributes, ForwardRefExoticComponent, RefAttributes, Context, FC, MemoExoticComponent, ReactNode, Component } from 'react';
import { StyledComponent } from 'styled-components';
import { EventEmitter } from 'events';

declare const ArrowUpward: OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
declare const ArrowDownward: OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
declare const SeparatorIcon: (props: any) => JSX.Element;

declare type RowsProp = RowData[];
declare type Rows = RowModel[];
/**
 * The key value object representing the data of a row.
 */
interface RowData extends ObjectWithId {
    [key: string]: any;
}
/**
 * The type of Id supported by the grid.
 */
declare type RowId = string | number;
/**
 * The cell value type.
 */
declare type CellValue = string | number | boolean | Date | null | undefined | object;
/**
 * The coordinates of cell represented by their row and column indexes.
 */
interface CellIndexCoordinates {
    colIndex: number;
    rowIndex: number;
}
interface ObjectWithId {
    id: RowId;
}
/**
 * The internal model of a row containing its state and data.
 */
interface RowModel {
    id: RowId;
    data: RowData;
    selected: boolean;
}
/**
 * An helper function allowing to create [[RowModel]] from [[RowData]].
 * @param a row as [[RowData]].
 * @returns a row as [[RowModel]].
 */
declare function createRow(r: RowData): RowModel;

declare type SortDirection = 'asc' | 'desc' | null | undefined;
declare type FieldComparatorList = {
    field: string;
    comparator: ComparatorFn;
}[];
/**
 * The type of the sort comparison function.
 */
declare type ComparatorFn = (v1: CellValue, v2: CellValue, row1: RowModel, row2: RowModel) => number;
/**
 * Object that represents the column sorted data, part of the [[SortModel]].
 */
interface SortItem {
    /**
     * The column field identifier
     */
    field: string;
    /**
     * The direction of the column that the grid should sort
     */
    sort: SortDirection;
}
/**
 * The model used for sorting the grid.
 */
declare type SortModel = SortItem[];

declare type NativeColTypes = 'string' | 'number' | 'date' | 'dateTime';
declare type ColType = NativeColTypes | string;

/**
 * Object passed as parameter in the column [[ColDef]] cell renderer.
 */
interface CellParams {
    /**
     * the cell value
     */
    value: CellValue;
    /**
     * A function that let you get data from other columns
     * @param field
     */
    getValue: (field: string) => CellValue;
    /**
     * The full set of data of the row that the current cell belongs to
     */
    data: RowData;
    /**
     * The row model  of the row that the current cell belongs to
     */
    rowModel: RowModel;
    /**
     * The column of the row that the current cell belongs to
     */
    colDef: any;
    /**
     * The row index of the row that the current cell belongs to
     */
    rowIndex: number;
    /**
     * ApiRef that let you manipulate the grid
     */
    api: any;
}
/**
 * Alias of CellParams.
 */
declare type ValueGetterParams = CellParams;
/**
 * Alias of CellParams.
 */
declare type ValueFormatterParams = CellParams;

/**
 * Alias of CellParams.
 */
declare type CellClassParams = CellParams;
/**
 * A function used to process cellClassParams.
 */
declare type CellClassFn = (params: CellClassParams) => string | string[];
/**
 * The union type representing the [[ColDef]] cell class type.
 */
declare type CellClassNamePropType = string | string[] | CellClassFn;
/**
 * An object representing the cell class rules.
 */
declare type CellClassRules = {
    [cssClass: string]: (params: CellClassParams) => boolean;
};

/**
 * Object passed as parameter in the column [[ColDef]] header renderer.
 */
interface ColParams {
    /**
     * The column of the current header component
     */
    colDef: any;
    /**
     * The column index of the current header component
     */
    colIndex: number;
    /**
     * ApiRef that let you manipulate the grid
     */
    api: any;
}

/**
 * Alignement used in position elements in Cells.
 */
declare type Alignement = 'left' | 'right' | 'center';
/**
 * Column Definition interface.
 */
interface ColDef {
    /**
     * String Column Identifier, used to map with [[RowData]] values
     */
    field: string;
    /**
     * The title of the column rendered in the column header cell
     */
    headerName?: string;
    /**
     * The description of the column rendered as tooltip if the column header name is not fully displayed
     */
    description?: string;
    /**
     * Set the width of the column
     * @default 100
     */
    width?: number;
    /**
     * Toggle the visibility of a column
     */
    hide?: boolean;
    /**
     * Make the column sortable
     * @default true
     */
    sortable?: boolean;
    /**
     * Make the column resizable
     * @default true
     */
    resizable?: boolean;
    /**
     * A comparator function used to sort rows
     */
    sortComparator?: ComparatorFn;
    /**
     * Sort the rows in a specific direction
     */
    sortDirection?: SortDirection;
    /**
     * If multiple columns are sorted, this setting allows to order the columns sorting sequence
     */
    sortIndex?: number;
    /**
     * Type allows to merge this object with a default definition [[ColDef]]
     * @default string
     */
    type?: ColType;
    /**
     * Allows to align the column values in cells
     */
    align?: Alignement;
    /**
     * Function that allows to get a specific data instead of field to render in the cell
     * @param params
     */
    valueGetter?: (params: ValueGetterParams) => CellValue;
    /**
     * Function that allows to apply a formatter before rendering its value
     * @param params
     */
    valueFormatter?: (params: ValueFormatterParams) => CellValue;
    /**
     * Css class that will be added in cells for that column
     */
    cellClassName?: CellClassNamePropType;
    /**
     * Set of css class rules that will be dynamically applied on cells
     */
    cellClassRules?: CellClassRules;
    /**
     * Allows to override the component rendered as cell for this column
     * @param params
     */
    renderCell?: (params: CellParams) => ReactElement;
    /**
     * Css class that will be added in the column header cell
     */
    headerClassName?: string | string[];
    /**
     * Allows to render a component in the column header cell
     * @param params
     */
    renderHeader?: (params: ColParams) => ReactElement;
    /**
     * Header cell element alignment
     */
    headerAlign?: Alignement;
    /**
     * Toggle the visibility of the sort icons
     */
    hideSortIcons?: boolean;
    /**
     * Allows to disable the click event in cells
     */
    disableClickEventBubbling?: boolean;
}
declare type Columns = ColDef[];
declare type ColTypeDef = Omit<ColDef, 'field'> & {
    extendType?: NativeColTypes;
};
/**
 * Meta Info about Columns.
 */
interface ColumnsMeta {
    totalWidth: number;
    positions: number[];
}
declare type ColumnLookup = {
    [field: string]: ColDef;
};
interface InternalColumns {
    all: Columns;
    visible: Columns;
    meta: ColumnsMeta;
    hasColumns: boolean;
    hasVisibleColumns: boolean;
    lookup: ColumnLookup;
}

declare const checkboxSelectionColDef: ColDef;

declare const getColDef: (columnTypes: any, type: ColType | undefined) => any;

declare const dateFormatter: ({ value }: {
    value: CellValue;
}) => string | number | boolean | object | null | undefined;
declare const dateTimeFormatter: ({ value }: {
    value: CellValue;
}) => string | number | boolean | object | null | undefined;
declare const DATE_COL_DEF: ColTypeDef;
declare const DATETIME_COL_DEF: ColTypeDef;

declare const NUMERIC_COL_DEF: ColTypeDef;

declare const STRING_COL_DEF: ColTypeDef;

declare type ColumnTypesRecord = Record<ColType, ColTypeDef>;

declare const DEFAULT_COL_TYPE_KEY = "__default__";
declare const DEFAULT_COLUMN_TYPES: ColumnTypesRecord;

/**
 * The size of a container.
 */
interface ElementSize {
    /**
     * The width of a container or HTMLElement
     */
    width: number;
    /**
     * The height of a container or HTMLElement
     */
    height: number;
}

/**
 * The set of container properties calculated on resize of the grid.
 */
interface ContainerProps {
    /**
     * Our rendering Zone constitute the maximum number of rows that will be rendered at any given time in the grid
     */
    renderingZonePageSize: number;
    /**
     * The number of rows that fit in the viewport
     */
    viewportPageSize: number;
    /**
     * The last page number
     */
    lastPage: number;
    /**
     * Indicates if a vertical scrollbar is visible
     */
    hasScrollY: boolean;
    /**
     * Indicates if an horizontal scrollbar is visible
     */
    hasScrollX: boolean;
    /**
     * The scrollbar size
     */
    scrollBarSize: number;
    /**
     * The total Element size required to render the set of rows including scrollbars
     */
    totalSizes: ElementSize;
    /**
     * The viewport size including scrollbars
     */
    windowSizes: ElementSize;
    /**
     * The size of the container containing all the rendered rows
     */
    renderingZone: ElementSize;
    /**
     * the size of the container holding the set of rows visible to the user
     */
    viewportSize: ElementSize;
    /**
     * The total Element size required to render the full set of rows minus the scrollbars
     */
    dataContainerSizes: ElementSize;
}

interface Logger {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
declare const noopLogger: Logger;
declare type LoggerFactoryFn = (name: string) => Logger;
declare function useLoggerFactory(customLogger?: Logger | LoggerFactoryFn, logLevel?: string | boolean): void;
declare function useLogger(name: string): Logger;

declare type UseRafUpdateReturnType = [(...args: any[]) => void, (fn: (args: any) => void) => void];
declare function useRafUpdate(initialFn?: (...args: any) => void): UseRafUpdateReturnType;

interface ScrollParams {
    left: number;
    top: number;
}
declare type ScrollFn = (v: ScrollParams) => void;
declare function useScrollFn(scrollingElementRef: RefObject<HTMLDivElement>, onScroll?: ScrollFn): [ScrollFn, ScrollFn];

/**
 * Object passed as parameter of the column header click event.
 */
interface ColumnHeaderClickedParams {
    /**
     * The column field of the column that triggered the event
     */
    field: string;
    /**
     * The column [[ColDef]] of the column that triggered the event
     */
    column: ColDef;
}

/**
 * Object passed as parameter of the column sorted event.
 */
interface ColumnSortedParams {
    /**
     * An array of column [[ColDef]] that the grid is sorted with. The array order corresponds to the order of sorting
     */
    sortedColumns: ColDef[];
    /**
     * The sort model used to sort the grid
     */
    sortModel: SortModel;
}

/**
 * The object passed as parameter of the Row click event handler.
 */
interface RowClickedParam {
    /**
     * The row element that trigger the click
     */
    element: HTMLElement;
    /**
     * The row model of the row that triggered the click
     */
    rowModel: RowModel;
    /**
     * The row data of the row that triggered the click
     */
    data: RowData;
    /**
     * The row index of the row that triggered the click
     */
    rowIndex: number;
    /**
     * The column of the row that triggered the click
     */
    colDef: ColDef;
}

/**
 * Object passed as parameter in the Cell Click event handler.
 */
interface CellClickedParam {
    /**
     * The HTMLElement that triggered the event
     */
    element: HTMLElement;
    /**
     * The value of the cell that triggered the event
     */
    value: CellValue;
    /**
     * The column field of the cell that triggered the event
     */
    field: string;
    /**
     * The other row data of the cell that triggered the event
     */
    data: RowData;
    /**
     * The row index of the cell that triggered the event
     */
    rowIndex: number;
    /**
     * The column of the cell that triggered the event
     */
    colDef: ColDef;
}

/**
 * Object passed as parameter as the row selected event handler.
 */
interface RowSelectedParams {
    /**
     * The row data of the row that triggers the event
     */
    data: RowData;
    /**
     * The row index of the row that triggers the event
     */
    rowIndex: number;
    /**
     * The selected state of the row that triggers the event
     */
    isSelected: boolean;
}

/**
 * Object passed as parameter as the selection changed event handler.
 */
interface SelectionChangedParams {
    /**
     * The set of rows that had their selection state changed.
     */
    rows: RowData[];
}

declare enum FeatureMode {
    Client = "Client",
    Server = "Server"
}

/**
 * Object passed as parameter of the page changed event handler.
 */
interface PageChangedParams {
    /**
     * The new page
     */
    page: number;
    /**
     * The total number of pages
     */
    pageCount: number;
    /**
     * The number of rows in a page
     */
    pageSize: number;
    /**
     * The total number of rows
     */
    rowCount: number;
    paginationMode: FeatureMode;
}

/**
 * Set of icons used in the grid component UI.
 */
interface IconsOptions {
    /**
     * Icon displayed on the side of the column header title when sorted in Ascending order.
     */
    columnSortedAscending?: ElementType;
    /**
     * Icon displayed on the side of the column header title when sorted in Descending order.
     */
    columnSortedDescending?: ElementType;
    /**
     * Icon displayed in between 2 column headers that allows to resize the column header.
     */
    columnResize?: ElementType<{
        className: string;
    }>;
}
/**
 * Grid options react prop, containing all the setting for the grid.
 */
interface GridOptions {
    /**
     * Turn grid height dynamic and follow the number of rows in the grid.
     * @default false
     */
    autoHeight?: boolean;
    /**
     * Set the height in pixel of a row in the grid.
     * @default 52
     */
    rowHeight: number;
    /**
     * Set the height in pixel of the column headers in the grid.
     * @default 56
     */
    headerHeight: number;
    /**
     * Set the height/width of the grid inner scrollbar.
     * @default 15
     */
    scrollbarSize: number;
    /**
     * Number of columns rendered outside the grid viewport.
     * @default 2
     */
    columnBuffer: number;
    /**
     * Enable multiple selection using the CTRL or CMD key.
     * @default true
     */
    enableMultipleSelection: boolean;
    /**
     * Enable sorting the grid rows with one or more columns.
     * @default true
     */
    enableMultipleColumnsSorting: boolean;
    /**
     * Display the right border of the cells.
     * @default false
     */
    showCellRightBorder?: boolean;
    /**
     * Display the column header right border.
     * @default false
     */
    showColumnRightBorder?: boolean;
    /**
     * Extend rows to fill the grid container width.
     * @default true
     */
    extendRowFullWidth?: boolean;
    /**
     * The order of the sorting sequence.
     * @default ['asc', 'desc', null]
     */
    sortingOrder: SortDirection[];
    /**
     * Activate pagination.
     * @default false
     */
    pagination?: boolean;
    /**
     * Set the number of rows in one page.
     * @default 100
     */
    pageSize?: number;
    /**
     * Auto-scale the pageSize with the container size to the max number of rows to avoid rendering a vertical scroll bar.
     * @default false
     */
    autoPageSize?: boolean;
    /**
     * Select the pageSize dynamically using the component UI.
     * @default [25, 50, 100]
     */
    rowsPerPageOptions?: number[];
    /**
     * Pagination can be processed on the server or client side.
     * Set it to FeatureMode.Client or `Client` if you would like to handle the pagination on the client side.
     * Set it to FeatureMode.Server or `Server` if you would like to handle the pagination on the server side.
     */
    paginationMode?: FeatureMode;
    /**
     * Set the total number of rows, if it is different than the length of the value `rows` prop
     */
    rowCount?: number;
    /**
     * Set the current page.
     * Default 1
     */
    page?: number;
    /**
     * Toggle footer component visibility.
     * @default false
     */
    hideFooter?: boolean;
    /**
     * Toggle footer row count element visibility.
     * @default false
     */
    hideFooterRowCount?: boolean;
    /**
     * Toggle footer selected row count element visibility.
     * @default false
     */
    hideFooterSelectedRowCount?: boolean;
    /**
     * Toggle footer pagination component visibility.
     * @default false
     */
    hideFooterPagination?: boolean;
    /**
     * Add a first column with checkbox that allows to select rows.
     * @default false
     */
    checkboxSelection?: boolean;
    /**
     * Disable selection on click on a row or cell.
     * @default false
     */
    disableSelectionOnClick?: boolean;
    /**
     * Pass a custom logger in the components that implements the [[Logger]] interface.
     * @default null
     */
    logger?: Logger;
    /**
     * Allows to pass the logging level or false to turn off logging.
     * @default debug
     */
    logLevel?: string | false;
    /**
     * Handler triggered when the click event comes from a cell element.
     * @param param with all properties from [[CellClickedParam]].
     */
    onCellClicked?: (param: CellClickedParam) => void;
    /**
     * Handler triggered when the click event comes from a row container element.
     * @param param with all properties from [[RowClickedParam]].
     */
    onRowClicked?: (param: RowClickedParam) => void;
    /**
     * Handler triggered when one row get selected.
     * @param param with all properties from [[RowSelectedParams]].
     */
    onRowSelected?: (param: RowSelectedParams) => void;
    /**
     * Handler triggered when one or multiple rows get their selection state changed.
     * @param param with all properties from [[SelectionChangedParams]]
     */
    onSelectionChanged?: (param: SelectionChangedParams) => void;
    /**
     * Handler triggered when the click event comes from a column header element.
     * @param param with all properties from [[ColumnHeaderClickedParams]].
     */
    onColumnHeaderClicked?: (param: ColumnHeaderClickedParams) => void;
    /**
     * Handler triggered when grid resorted its rows.
     * @param param with all properties from [[ColumnSortedParams]].
     */
    onColumnsSorted?: (params: ColumnSortedParams) => void;
    /**
     * Handler triggered when the current page has changed.
     * @param param with all properties from [[PageChangedParams]].
     */
    onPageChanged?: (param: PageChangedParams) => void;
    /**
     * Handler triggered when the page size changed.
     * @param param with all properties from [[PageChangedParams]].
     */
    onPageSizeChanged?: (param: PageChangedParams) => void;
    /**
     * Set of icons used in the grid.
     */
    icons: IconsOptions;
    /**
     * Extend native column types with your new column types.
     */
    columnTypes: ColumnTypesRecord;
}
/**
 * The default [[GridOptions]] object that will be used to merge with the 'options' passed in the react component prop.
 */
declare const DEFAULT_GRID_OPTIONS: GridOptions;

/**
 * The ref type of the inner grid root container.
 */
declare type RootContainerRef = RefObject<HTMLDivElement>;

/**
 * The object containing the column properties of the rendering state.
 */
interface RenderColumnsProps {
    /**
     * The column index of the first rendered column
     */
    firstColIdx: number;
    /**
     * The column index of the last rendered column
     */
    lastColIdx: number;
    /**
     * The left empty width required to position the viewport at the beginning of the first rendered column
     */
    leftEmptyWidth: number;
    /**
     * The right empty width limit the position the viewport to the end of the last rendered column
     */
    rightEmptyWidth: number;
}
/**
 * The object containing the row properties of the rendering state.
 */
interface RenderRowProps {
    /**
     * The rendering zone page calculated with the scroll position
     */
    page: number;
    /**
     * The first rendered row in the rendering zone
     */
    firstRowIdx: number;
    /**
     * The last rendered row in the rendering zone
     */
    lastRowIdx: number;
}
/**
 * The object containing the pagination properties of the rendering state.
 */
interface RenderPaginationProps {
    /**
     * The current page if pagination is enabled
     */
    paginationCurrentPage?: number;
    /**
     * The current page size if pagination is enabled
     */
    pageSize?: number;
}
/**
 * The full rendering state.
 */
declare type RenderContextProps = ContainerProps & RenderColumnsProps & RenderRowProps & RenderPaginationProps;

/**
 * The Row API interface that is available in the grid [[apiRef]].
 */
interface RowApi {
    /**
     * Get the full set of rows as [[Rows]]
     * @returns [[Rows]]
     */
    getRowModels: () => Rows;
    /**
     * Get the total number of rows in the grid
     */
    getRowsCount: () => number;
    /**
     * Return the list of row Ids
     */
    getAllRowIds: () => RowId[];
    /**
     * Set a new set of Rows
     * @param rows
     */
    setRowModels: (rows: Rows) => void;
    /**
     * Update any properties of the current set of Rows
     * @param updates
     */
    updateRowModels: (updates: Partial<RowModel>[]) => void;
    /**
     * Update any properties of the current set of RowData[]
     * @param updates
     */
    updateRowData: (updates: RowData[]) => void;
    /**
     * Get the RowId of a row at a specific position
     * @param index
     */
    getRowIdFromRowIndex: (index: number) => RowId;
    /**
     * Get the row index of a row with a given Id
     * @param id
     */
    getRowIndexFromId: (id: RowId) => number;
    /**
     * Get the [[RowModel]] of a given rowId
     * @param id
     */
    getRowFromId: (id: RowId) => RowModel;
}

/**
 * The column API interface that is available in the grid [[apiRef]].
 */
interface ColumnApi {
    /**
     * Retrieve a column from its field
     * @return [[ColDef]]
     * @param field
     */
    getColumnFromField: (field: string) => ColDef;
    /**
     * Get all the [[Columns]]
     * @return an array of [[ColDef]]
     */
    getAllColumns: () => Columns;
    /**
     * Get the currently visible columns
     * @returns an array of [[ColDef]]
     */
    getVisibleColumns: () => Columns;
    /**
     * Get the columns meta data
     * @return [[ColumnsMeta]]
     */
    getColumnsMeta: () => ColumnsMeta;
    /**
     * Get the index position of the column in the array of [[ColDef]]
     * @param field
     */
    getColumnIndex: (field: string) => number;
    /**
     * Get the column left position in pixel relative to the left grid inner border
     * @param field
     */
    getColumnPosition: (field: string) => number;
    /**
     * Allows to update a column [[ColDef]] model
     * @param col [[ColDef]]
     */
    updateColumn: (col: ColDef) => void;
    /**
     * Allows to batch update multiple columns at the same time
     * @param cols [[ColDef[]]]
     */
    updateColumns: (cols: ColDef[]) => void;
}

/**
 * The Selection API interface that is available in the grid [[apiRef]].
 */
interface SelectionApi {
    /**
     * Toggle the row selected state
     * @param id
     * @param allowMultiple, default: false = deselect other rows if isSelected is true
     * @param isSelected, default true
     */
    selectRow: (id: RowId, allowMultiple?: boolean, isSelected?: boolean) => void;
    /**
     * Batch toggle rows selected state
     *
     * @param ids
     * @param isSelected default true
     * @param deselectOtherRows default: false
     */
    selectRows: (ids: RowId[], isSelected?: boolean, deselectOtherRows?: boolean) => void;
    /**
     * Get an array of selected rows
     */
    getSelectedRows: () => RowModel[];
    /**
     * Handler triggered after a row is selected
     * @param handler
     */
    onSelectedRow: (handler: (param: RowSelectedParams) => void) => () => void;
    /**
     * Handler triggered after one or multiple rows had a selection state changed.
     * @param handler
     */
    onSelectionChanged: (handler: (param: SelectionChangedParams) => void) => () => void;
}

/**
 * The Sort API interface that is available in the grid [[apiRef]].
 */
interface SortApi {
    /**
     * Get the sort model currently applied in the grid
     */
    getSortModel: () => SortModel;
    /**
     * Set the sort model of the component and trigger a new sorting of rows
     * @param model
     */
    setSortModel: (model: SortModel) => void;
    /**
     * Handler triggered after the grid has sorted its rows
     * @param handler
     */
    onColumnsSorted: (handler: (param: ColumnSortedParams) => void) => () => void;
}

/**
 * The pagination API interface that is available in the grid [[apiRef]].
 */
interface PaginationApi {
    /**
     * Set the displayed page
     * @param page
     */
    setPage: (page: number) => void;
    /**
     * Set the number of rows in one page
     * @param pageSize
     */
    setPageSize: (pageSize: number) => void;
    /**
     * Handler that is triggered after a new page has been displayed
     * @param handler
     */
    onPageChanged: (handler: (param: PageChangedParams) => void) => () => void;
    /**
     * Handler that is triggered after the page size was changed
     * @param handler
     */
    onPageSizeChanged: (handler: (param: PageChangedParams) => void) => () => void;
}

/**
 * The Virtualization API interface that is available in the grid [[apiRef]].
 */
interface VirtualizationApi {
    /**
     * Trigger the grid viewport to scroll to the position in pixel
     * @param params
     */
    scroll: (params: Partial<ScrollParams>) => void;
    /**
     * Trigger the grid viewport to scroll to a row of x y indexes
     * @param params
     */
    scrollToIndexes: (params: CellIndexCoordinates) => void;
    /**
     * Check if a column at index is currently visible in the viewport
     * @param colIndex
     */
    isColumnVisibleInWindow: (colIndex: number) => boolean;
    /**
     * Get the current containerProps
     */
    getContainerPropsState: () => ContainerProps | null;
    /**
     * Get the current renderContext
     */
    getRenderContextState: () => Partial<RenderContextProps> | undefined;
    /**
     * Force the rendering engine to render a particular page. Not for pagination
     * @param page
     */
    renderPage: (page: number) => void;
}

/**
 * The Core API interface that is available in the grid [[apiRef]].
 */
interface CoreApi extends EventEmitter {
    /**
     * Property that comes true when the grid has its EventEmitter initialised
     */
    isInitialised: boolean;
    /**
     * Allows to register a handler for an event
     * @param event
     * @param handler
     */
    registerEvent: (event: string, handler: (param: any) => void) => () => void;
    /**
     * Add a handler that will be triggered when the component unmount
     * @param handler
     */
    onUnmount: (handler: (param: any) => void) => void;
    /**
     * Add a handler that will be triggered when the component resize
     * @param handler
     */
    onResize: (handler: (param: any) => void) => void;
    /**
     * Trigger a resize of the component, and recalculation of width and height
     * @param handler
     */
    resize: () => void;
}
/**
 * The full Grid API.
 */
declare type GridApi = RowApi & ColumnApi & SelectionApi & SortApi & VirtualizationApi & CoreApi & PaginationApi;

/**
 * The apiRef component prop type.
 */
declare type ApiRef = MutableRefObject<GridApi | null | undefined>;

interface PaginationProps {
    page: number;
    pageCount: number;
    pageSize: number;
    rowCount: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
}
declare type PaginationState = PageChangedParams;
declare const usePagination: (rows: Rows, columns: InternalColumns, options: GridOptions, apiRef: ApiRef) => PaginationProps;

/**
 * Object passed as React prop in the component override.
 */
interface ComponentParams {
    /**
     * The object containing all pagination details in [[PaginationProps]]
     */
    paginationProps: PaginationProps;
    /**
     * The full set of rows
     */
    rows: Rows;
    /**
     * The full set of columns
     */
    columns: Columns;
    /**
     * The full set of options
     */
    options: GridOptions;
    /**
     * ApiRef that let you manipulate the grid
     */
    api: ApiRef;
    /**
     * The ref of the inner div Element of the grid
     */
    rootElement: RootContainerRef;
}

/**
 * Grid components React prop interface containing all the overridable components.
 */
interface GridComponentOverridesProp {
    /**
     * pagination component rendered in the grid footer by default
     */
    pagination?: ElementType<ComponentParams>;
    /**
     * loadingOverlay component rendered when the grid is in a loading state
     */
    loadingOverlay?: ElementType<ComponentParams>;
    /**
     * noRowsOverlay component rendered when the grid has no rows
     */
    noRowsOverlay?: ElementType<ComponentParams>;
    /**
     * footer component rendered at the bottom of the grid viewport
     */
    footer?: ElementType<ComponentParams>;
    /**
     * header component rendered above the grid column header bar
     */
    header?: ElementType<ComponentParams>;
}

declare type DivProps = HTMLAttributes<HTMLDivElement>;
interface GridRootProps {
    options: GridOptions;
}
declare const RootStyle: StyledComponent<"div", any, GridRootProps, never>;
declare const GridRoot: ForwardRefExoticComponent<GridRootProps & DivProps & RefAttributes<HTMLDivElement>>;

declare const ColumnsContainer: ForwardRefExoticComponent<DivProps & RefAttributes<HTMLDivElement>>;

declare const DataContainer: ForwardRefExoticComponent<DivProps & RefAttributes<HTMLDivElement>>;

declare const Footer: ForwardRefExoticComponent<DivProps & RefAttributes<HTMLDivElement>>;

declare const Window: ForwardRefExoticComponent<DivProps & RefAttributes<HTMLDivElement>>;

declare const Overlay: StyledComponent<"div", any, {}, never>;
declare function GridOverlay(props: DivProps): JSX.Element;
declare namespace GridOverlay {
    var displayName: string;
}

declare const ApiContext: Context<ApiRef | undefined>;

declare function AutoSizerWrapper(props: any): JSX.Element;

interface GridCellProps {
    field?: string;
    value?: CellValue;
    formattedValue?: CellValue;
    width: number;
    showRightBorder?: boolean;
    align?: Alignement;
    cssClass?: string;
    tabIndex?: number;
    colIndex?: number;
    rowIndex?: number;
}
declare const Cell: FC<GridCellProps>;
declare const LeftEmptyCell: FC<{
    width?: number;
}>;
declare const RightEmptyCell: FC<{
    width?: number;
}>;

declare const HeaderCheckbox: FC<ColParams>;
declare const CellCheckboxRenderer: FC<CellParams>;

interface ColumnHeaderItemProps {
    column: ColDef;
    headerHeight: number;
    colIndex: number;
    onResizeColumn?: (c: any) => void;
}
declare const ColumnHeaderItem: MemoExoticComponent<({ column, colIndex, headerHeight, onResizeColumn }: ColumnHeaderItemProps) => JSX.Element>;

interface ColumnHeaderSortIconProps {
    direction: SortDirection;
    index: number | undefined;
    hide?: boolean;
}
declare const ColumnHeaderSortIcon: FC<ColumnHeaderSortIconProps>;

interface ColumnHeaderTitleProps {
    label: string;
    columnWidth: number;
    description?: string;
}
declare const ColumnHeaderTitle: FC<ColumnHeaderTitleProps>;

interface ColumnHeaderSeparatorProps {
    resizable: boolean | undefined;
    onResize?: () => void;
}
declare const ColumnHeaderSeparator: FC<ColumnHeaderSeparatorProps>;

interface ColumnHeadersItemCollectionProps {
    columns: Columns;
    headerHeight: number;
    onResizeColumn?: (col: ColDef) => void;
}
declare const ColumnHeaderItemCollection: FC<ColumnHeadersItemCollectionProps>;
interface ColumnsHeaderProps {
    columns: Columns;
    hasScrollX: boolean;
    headerHeight: number;
    onResizeColumn?: (col: ColDef) => void;
    renderCtx: Partial<RenderContextProps> | null;
}
declare const ColumnsHeader: MemoExoticComponent<ForwardRefExoticComponent<ColumnsHeaderProps & RefAttributes<HTMLDivElement>>>;

interface DefaultFooterProps {
    options: GridOptions;
    paginationComponent: ReactNode;
    rowCount: number;
}
declare const DefaultFooter: ForwardRefExoticComponent<DefaultFooterProps & RefAttributes<HTMLDivElement>>;

declare function LoadingOverlay(): JSX.Element;

declare function NoRowMessage(): JSX.Element;

declare const OptionsContext: Context<GridOptions | undefined>;

interface PaginationComponentProps {
    pageCount: number;
    setPage: (pageCount: number) => void;
    setPageSize: (pageSize: number) => void;
    currentPage: number;
    rowCount: number;
    pageSize: number;
    rowsPerPageOptions?: number[];
}
declare const Pagination: FC<PaginationComponentProps>;

declare const RenderContext: Context<Partial<RenderContextProps> | null>;

declare type WithChildren = {
    children?: ReactNode;
};
declare const RenderingZone: ForwardRefExoticComponent<ElementSize & WithChildren & RefAttributes<HTMLDivElement>>;

interface RowProps {
    id: RowId;
    selected: boolean;
    className: string;
    rowIndex: number;
}
declare const Row: FC<RowProps>;

interface RowCellsProps {
    firstColIdx: number;
    lastColIdx: number;
    hasScroll: {
        y: boolean;
        x: boolean;
    };
    scrollSize: number;
    columns: Columns;
    row: RowModel;
    showCellRightBorder: boolean;
    extendRowFullWidth: boolean;
    rowIndex: number;
    domIndex: number;
}
declare const RowCells: FC<RowCellsProps>;

declare const RowCount: FC<{
    rowCount: number;
}>;

declare const SelectedRowCount: FC<{
    selectedRowCount: number;
}>;

declare const StickyContainer: FC<ElementSize>;

interface ViewportProps {
    rows: RowModel[];
    visibleColumns: Columns;
    options: GridOptions;
    children?: ReactNode;
}
declare type ViewportType = ForwardRefExoticComponent<ViewportProps & RefAttributes<HTMLDivElement>>;
declare const Viewport: ViewportType;

interface WatermarkProps {
    licenseStatus: string;
}
declare const Watermark: FC<WatermarkProps>;

declare const RESIZE = "resize";
declare const UNMOUNT = "unmount";
declare const CLICK_EVENT = "click";
declare const KEYDOWN_EVENT = "keydown";
declare const KEYUP_EVENT = "keyup";
declare const CELL_CLICKED = "cellClicked";
declare const ROW_CLICKED = "rowClicked";
declare const ROW_SELECTED_EVENT = "rowSelected";
declare const SELECTION_CHANGED_EVENT = "selectionChanged";
declare const COLUMN_HEADER_CLICKED = "columnClicked";
declare const PAGE_CHANGED_EVENT = "pageChanged";
declare const PAGESIZE_CHANGED_EVENT = "pageSizeChanged";
declare const SCROLLING_START = "scrolling:start";
declare const SCROLLING = "scrolling";
declare const SCROLLING_STOP = "scrolling:stop";
declare const COL_RESIZE_START = "colResizing:start";
declare const COL_RESIZE_STOP = "colResizing:stop";
declare const ROWS_UPDATED = "rowsUpdated";
declare const COLUMNS_UPDATED = "columnsUpdated";
declare const SORT_MODEL_UPDATED = "sortModelUpdated";
declare const POST_SORT = "postSort";
declare const COLUMNS_SORTED = "columnsSorted";
declare const MULTIPLE_KEY_PRESS_CHANGED = "multipleKeyPressChanged";

declare const CELL_CSS_CLASS = "material-cell";
declare const ROW_CSS_CLASS = "material-row";
declare const HEADER_CELL_CSS_CLASS = "material-col-cell";
declare const ROOT_CSS_CLASS = "grid-root";
declare const DATA_CONTAINER_CSS_CLASS = "data-container";

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
declare const useApiRef: () => ApiRef;

declare const useComponents: (columns: InternalColumns, rows: Rows, options: GridOptions, componentOverrides: GridComponentOverridesProp | undefined, paginationProps: PaginationProps, apiRef: ApiRef, gridRootRef: RootContainerRef) => {
    headerComponent: ReactElement<ComponentParams, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)> | null;
    footerComponent: ReactElement<ComponentParams, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)> | null;
    loadingComponent: JSX.Element;
    noRowsComponent: JSX.Element;
    paginationComponent: ReactElement<ComponentParams, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)> | null;
};

declare const useColumnResize: (columnsRef: RefObject<HTMLDivElement>, apiRef: ApiRef, headerHeight: number) => (col: ColDef) => void;

declare const useSelection: (options: GridOptions, rowsProp: RowsProp, initialised: boolean, apiRef: ApiRef) => void;

declare const useSorting: (options: GridOptions, rowsProp: RowsProp, colsProp: Columns, apiRef: ApiRef) => void;

declare function useApi(gridRootRef: RefObject<HTMLDivElement>, windowRef: RefObject<HTMLDivElement>, options: GridOptions, apiRef: ApiRef): boolean;

declare function useApiEventHandler(apiRef: ApiRef, eventName: string, handler?: (args: any) => void): void;

declare function useApiMethod(apiRef: ApiRef, apiMethods: Partial<GridApi>, apiName: string): void;

declare function useColumns(options: GridOptions, columns: Columns, apiRef: ApiRef): InternalColumns;

declare type ReturnType = (options: GridOptions, columnsTotalWidth: number, rowsCount: number) => ContainerProps | null;
declare const useContainerProps: (windowRef: RefObject<HTMLDivElement>) => ReturnType;

declare const useKeyboard: (options: GridOptions, initialised: boolean, apiRef: ApiRef) => void;

declare const useNativeEventListener: (apiRef: ApiRef, ref: MutableRefObject<HTMLDivElement | null> | (() => Element | undefined | null), eventName: string, handler?: ((event: Event) => any) | undefined, options?: AddEventListenerOptions | undefined) => void;

declare const useRows: (options: GridOptions, rows: RowsProp, initialised: boolean, apiRef: ApiRef) => RowModel[];

declare type UpdateRenderedColsFnType = (containerProps: ContainerProps | null, scrollLeft: number) => boolean;
declare type UseVirtualColumnsReturnType = [React.MutableRefObject<RenderColumnsProps | null>, UpdateRenderedColsFnType];
declare const useVirtualColumns: (options: GridOptions, apiRef: ApiRef) => UseVirtualColumnsReturnType;

declare type UseVirtualRowsReturnType = Partial<RenderContextProps> | null;
declare const useVirtualRows: (colRef: React.MutableRefObject<HTMLDivElement | null>, windowRef: React.MutableRefObject<HTMLDivElement | null>, renderingZoneRef: React.MutableRefObject<HTMLDivElement | null>, internalColumns: InternalColumns, rows: Rows, options: GridOptions, apiRef: ApiRef) => UseVirtualRowsReturnType;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
declare function isEqual(value: any, other: any): boolean;

interface DebouncedFunction extends Function {
    cancel: () => void;
    flush: () => void;
}
declare function debounce(func: any, wait?: number, options?: any): DebouncedFunction;
declare function isDate(value: any): value is Date;
declare function isArray(value: any): value is Array<any>;
declare function isString(value: any): value is string;
declare function isNumber(value: any): value is number;
declare function isFunction(value: any): value is Function;
declare function isObject(value: any): value is Record<string, any>;

declare const nextSortDirection: (sortingOrder: SortDirection[], current?: SortDirection) => SortDirection;
declare const isDesc: (direction: SortDirection) => boolean;
declare const nillComparer: (v1: CellValue, v2: CellValue) => number | null;
declare const stringNumberComparer: ComparatorFn;
declare const numberComparer: ComparatorFn;
declare const dateComparer: (v1: CellValue, v2: CellValue) => number;

declare function isOverflown(element: Element): boolean;
declare function findParentElementFromClassName(elem: Element, className: string): Element | null;
declare function isCell(elem: Element | null): boolean;
declare function isHeaderCell(elem: Element): boolean;
declare function getDataFromElem(elem: Element, field: string): string;
declare function getIdFromRowElem(rowEl: Element): string;
declare function getFieldFromHeaderElem(colCellEl: Element): string;
declare function findCellElementsFromCol(col: HTMLElement): NodeListOf<Element> | null;
declare function findGridRootFromCurrent(elem: Element): HTMLDivElement | null;
declare function findDataContainerFromCurrent(elem: Element): HTMLDivElement | null;
declare function getCellElementFromIndexes(root: Element, { colIndex, rowIndex }: CellIndexCoordinates): HTMLDivElement;

declare function classnames(...args: any[]): string;

declare const MULTIPLE_SELECTION_KEYS: string[];
declare const isMultipleKey: (code: string) => boolean;
declare const isTabKey: (code: string) => boolean;
declare const isSpaceKey: (code: string) => boolean;
declare const isArrowKeys: (code: string) => boolean;
declare const isHomeOrEndKeys: (code: string) => boolean;
declare const isPageKeys: (code: string) => boolean;
declare const isNavigationKey: (code: string) => boolean;

declare function mergeColTypes(defaultColumnTypes: ColumnTypesRecord, optionsColTypes: ColumnTypesRecord): ColumnTypesRecord;
declare function mergeOptions(defaultOptions: any, options?: any): any;

/**
 * Partial set of [[GridOptions]].
 */
declare type GridOptionsProp = Partial<GridOptions>;
/**
 * The grid component react props interface.
 */
interface GridComponentProps {
    /**
     * Set of rows of type [[RowsProp]]
     */
    rows: RowsProp;
    /**
     * Set of columns of type [[Columns]]
     */
    columns: Columns;
    /**
     * Set of options of type [[GridOptionsProp]]
     */
    options?: GridOptionsProp;
    /**
     * Overrideable components
     */
    components?: GridComponentOverridesProp;
    /**
     * The ref object that allows grid manipulation. Can be instantiated with [[gridApiRef()]]
     */
    apiRef?: ApiRef;
    /**
     * Boolean prop that toggle the loading overlay
     */
    loading?: boolean;
    /**
     * String prop that allows to pass extra Css class in the inner grid container.
     */
    className?: string;
    /**
     * @internal enum
     */
    licenseStatus: string;
}

/**
 * Material-UI Grid React component implementing [[GridComponentProps]].
 * @return JSX.Element.
 */
declare const GridComponent: FC<GridComponentProps>;

export { Alignement, ApiContext, ApiRef, ArrowDownward, ArrowUpward, AutoSizerWrapper, CELL_CLICKED, CELL_CSS_CLASS, CLICK_EVENT, COLUMNS_SORTED, COLUMNS_UPDATED, COLUMN_HEADER_CLICKED, COL_RESIZE_START, COL_RESIZE_STOP, Cell, CellCheckboxRenderer, CellClassFn, CellClassNamePropType, CellClassParams, CellClassRules, CellClickedParam, CellIndexCoordinates, CellParams, CellValue, ColDef, ColParams, ColType, ColTypeDef, ColumnApi, ColumnHeaderClickedParams, ColumnHeaderItem, ColumnHeaderItemCollection, ColumnHeaderSeparator, ColumnHeaderSeparatorProps, ColumnHeaderSortIcon, ColumnHeaderSortIconProps, ColumnHeaderTitle, ColumnHeaderTitleProps, ColumnHeadersItemCollectionProps, ColumnLookup, ColumnSortedParams, ColumnTypesRecord, Columns, ColumnsContainer, ColumnsHeader, ColumnsHeaderProps, ColumnsMeta, ComparatorFn, ComponentParams, ContainerProps, CoreApi, DATA_CONTAINER_CSS_CLASS, DATETIME_COL_DEF, DATE_COL_DEF, DEFAULT_COLUMN_TYPES, DEFAULT_COL_TYPE_KEY, DEFAULT_GRID_OPTIONS, DataContainer, DebouncedFunction, DefaultFooter, DefaultFooterProps, DivProps, ElementSize, FeatureMode, FieldComparatorList, Footer, GridApi, GridCellProps, GridComponent, GridComponentOverridesProp, GridComponentProps, GridOptions, GridOptionsProp, GridOverlay, GridRoot, GridRootProps, HEADER_CELL_CSS_CLASS, HeaderCheckbox, IconsOptions, InternalColumns, KEYDOWN_EVENT, KEYUP_EVENT, LeftEmptyCell, LoadingOverlay, Logger, LoggerFactoryFn, MULTIPLE_KEY_PRESS_CHANGED, MULTIPLE_SELECTION_KEYS, NUMERIC_COL_DEF, NativeColTypes, NoRowMessage, ObjectWithId, OptionsContext, Overlay, PAGESIZE_CHANGED_EVENT, PAGE_CHANGED_EVENT, POST_SORT, PageChangedParams, Pagination, PaginationApi, PaginationComponentProps, PaginationProps, PaginationState, RESIZE, ROOT_CSS_CLASS, ROWS_UPDATED, ROW_CLICKED, ROW_CSS_CLASS, ROW_SELECTED_EVENT, RenderColumnsProps, RenderContext, RenderContextProps, RenderPaginationProps, RenderRowProps, RenderingZone, RightEmptyCell, RootContainerRef, RootStyle, Row, RowApi, RowCells, RowClickedParam, RowCount, RowData, RowId, RowModel, RowProps, RowSelectedParams, Rows, RowsProp, SCROLLING, SCROLLING_START, SCROLLING_STOP, SELECTION_CHANGED_EVENT, SORT_MODEL_UPDATED, STRING_COL_DEF, ScrollFn, ScrollParams, SelectedRowCount, SelectionApi, SelectionChangedParams, SeparatorIcon, SortApi, SortDirection, SortItem, SortModel, StickyContainer, UNMOUNT, ValueFormatterParams, ValueGetterParams, Viewport, ViewportProps, VirtualizationApi, Watermark, WatermarkProps, Window, checkboxSelectionColDef, classnames, createRow, dateComparer, dateFormatter, dateTimeFormatter, debounce, findCellElementsFromCol, findDataContainerFromCurrent, findGridRootFromCurrent, findParentElementFromClassName, getCellElementFromIndexes, getColDef, getDataFromElem, getFieldFromHeaderElem, getIdFromRowElem, isArray, isArrowKeys, isCell, isDate, isDesc, isEqual, isFunction, isHeaderCell, isHomeOrEndKeys, isMultipleKey, isNavigationKey, isNumber, isObject, isOverflown, isPageKeys, isSpaceKey, isString, isTabKey, mergeColTypes, mergeOptions, nextSortDirection, nillComparer, noopLogger, numberComparer, stringNumberComparer, useApi, useApiEventHandler, useApiMethod, useApiRef, useColumnResize, useColumns, useComponents, useContainerProps, useKeyboard, useLogger, useLoggerFactory, useNativeEventListener, usePagination, useRafUpdate, useRows, useScrollFn, useSelection, useSorting, useVirtualColumns, useVirtualRows };
import { GridComponentProps } from '@material-ui/x-grid-modules';
export * from '@material-ui/x-grid-modules';
export * from '@material-ui/x-license';
import { FC } from 'react';

declare type XGridProps = Omit<GridComponentProps, 'licenseStatus'>;
declare const XGrid: FC<XGridProps>;

export { XGrid, XGridProps };
