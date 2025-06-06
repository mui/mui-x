import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { Column, FocusedCell, Size, PinnedRows, PinnedColumns, PinnedRowPosition, GridRenderContext, GridColumnsRenderContext, Row, RowEntry } from './models';
export type VirtualScroller = ReturnType<typeof useVirtualizer>;
export declare const EMPTY_DETAIL_PANELS: Readonly<Map<any, React.ReactNode>>;
export declare const EMPTY_RENDER_CONTEXT: {
    firstRowIndex: number;
    lastRowIndex: number;
    firstColumnIndex: number;
    lastColumnIndex: number;
};
type VirtualizerParams = {
    initialState?: {
        scroll?: {
            top: number;
            left: number;
        };
    };
    isRtl: boolean;
    rows: RowEntry[];
    /** current page range */
    range: {
        firstRowIndex: number;
        lastRowIndex: number;
    } | null;
    columns: Column[];
    enabledForRows: boolean;
    enabledForColumns: boolean;
    pinnedRows: PinnedRows;
    pinnedColumns: PinnedColumns;
    isRowSelected: (id: any) => boolean;
    refs: {
        main: RefObject<HTMLElement | null>;
        scroller: RefObject<HTMLElement | null>;
        scrollbarVertical: RefObject<HTMLElement | null>;
        scrollbarHorizontal: RefObject<HTMLElement | null>;
    };
    hasColSpan: boolean;
    rowHeight: number;
    contentHeight: number;
    minimalContentHeight: number | string;
    columnsTotalWidth: number;
    needsHorizontalScrollbar: boolean;
    verticalScrollbarWidth: number;
    hasFiller: boolean;
    autoHeight: boolean;
    onResize?: (lastSize: Size) => void;
    onWheel?: (event: React.WheelEvent) => void;
    onTouchMove?: (event: React.TouchEvent) => void;
    renderContext: GridRenderContext;
    focusedCell: FocusedCell | null;
    rowBufferPx: number;
    columnBufferPx: number;
    scrollReset?: any;
    fixme: {
        dimensions: () => any;
        renderContext: () => GridRenderContext;
        setRenderContext: (c: GridRenderContext) => void;
        onContextChange: (c: GridRenderContext) => void;
        inputs: () => RenderContextInputs;
        onScrollChange: (scrollPosition: any, nextRenderContext: any) => void;
        rowTree: () => any;
        columnPositions: () => any;
        calculateColSpan: (params: {
            rowId: any;
            minFirstColumn: number;
            maxLastColumn: number;
            columns: Column[];
        }) => void;
        getRowHeight: (id: any) => number | 'auto';
        renderRow: (params: {
            id: any;
            model: Row;
            rowIndex: number;
            offsetLeft: number;
            columnsTotalWidth: number;
            baseRowHeight: number | 'auto';
            columns: Column[];
            firstColumnIndex: number;
            lastColumnIndex: number;
            focusedColumnIndex: number | undefined;
            isFirstVisible: boolean;
            isLastVisible: boolean;
            isVirtualFocusRow: boolean;
            showBottomBorder: boolean;
        }) => React.ReactElement;
        renderInfiniteLoadingTrigger: (id: any) => React.ReactElement;
    };
};
export declare const useVirtualizer: (params: VirtualizerParams) => {
    renderContext: GridRenderContext;
    forceUpdateRenderContext: () => void;
    setPanels: React.Dispatch<React.SetStateAction<Readonly<Map<any, React.ReactNode>>>>;
    getRows: (params?: {
        rows?: RowEntry[];
        position?: PinnedRowPosition;
        renderContext?: GridRenderContext;
    }) => React.ReactNode[];
    getContainerProps: () => {
        ref: (node: HTMLDivElement | null) => (() => void) | undefined;
    };
    getScrollerProps: () => {
        ref: React.RefObject<HTMLElement | null>;
        onScroll: () => void;
        onWheel: ((event: React.WheelEvent) => void) | undefined;
        onTouchMove: ((event: React.TouchEvent) => void) | undefined;
        style: React.CSSProperties;
        role: string;
        tabIndex: number | undefined;
    };
    getContentProps: () => {
        style: React.CSSProperties;
        role: string;
        ref: (node: HTMLDivElement | null) => void;
    };
    getRenderZoneProps: () => {
        role: string;
    };
    getScrollbarVerticalProps: () => {
        ref: React.RefObject<HTMLElement | null>;
        scrollPosition: React.RefObject<{
            top: number;
            left: number;
        }>;
    };
    getScrollbarHorizontalProps: () => {
        ref: React.RefObject<HTMLElement | null>;
        scrollPosition: React.RefObject<{
            top: number;
            left: number;
        }>;
    };
    getScrollAreaProps: () => {
        scrollPosition: React.RefObject<{
            top: number;
            left: number;
        }>;
    };
};
type RenderContextInputs = any;
export declare function areRenderContextsEqual(context1: GridRenderContext, context2: GridRenderContext): boolean;
export declare function computeOffsetLeft(columnPositions: number[], renderContext: GridColumnsRenderContext, pinnedLeftLength: number): number;
export declare function roundToDecimalPlaces(value: number, decimals: number): number;
export {};
