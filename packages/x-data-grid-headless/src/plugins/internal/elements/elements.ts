'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { type Plugin, createPlugin } from '../../core/plugin';
import type { GridRowId } from '../rows/rowUtils';
import type { VirtualizationPlugin } from '../../virtualization';
import rowsPlugin from '../rows/rows';
import columnsPlugin from '../columns/columns';

const gridStaticProps = {
  role: 'grid',
  tabIndex: -1,
  'aria-multiselectable': false,
} as const;

type GridProps = typeof gridStaticProps & {
  'aria-colcount': number;
  'aria-rowcount': number;
};

const containerStaticProps = {
  role: 'presentation',
} as const;

type ContainerProps = typeof containerStaticProps & {
  ref?: React.RefCallback<any> | React.RefObject<any | null>;
};

const scrollerStaticProps = {
  role: 'presentation',
};

type ScrollerProps = typeof scrollerStaticProps & {
  ref?: React.RefCallback<HTMLElement> | React.RefObject<HTMLElement | null>;
  style?: React.CSSProperties;
  tabIndex?: number;
};

const contentStaticProps = {
  role: 'presentation',
};

type ContentProps = typeof contentStaticProps & {
  style?: React.CSSProperties;
};

const positionerStaticProps = {
  role: 'rowgroup',
};

type PositionerProps = typeof positionerStaticProps & {
  style?: React.CSSProperties;
};

const scrollbarStaticProps = {
  tabIndex: -1,
} as const;

type ScrollbarProps = typeof scrollbarStaticProps & {
  ref?: React.RefCallback<HTMLElement> | React.RefObject<HTMLElement | null>;
  zIndex?: number;
};

const scrollAreaStaticProps = {} as const;

type ScrollAreaProps = typeof scrollAreaStaticProps;

const rowStaticProps = {
  role: 'row',
} as const;

type RowProps = typeof rowStaticProps & {
  'data-id': GridRowId;
  'data-rowindex': number;
  'aria-rowindex': number;
  'aria-selected'?: boolean;
};

const cellStaticProps = {
  role: 'gridcell',
  'aria-colspan': 1,
  'aria-rowspan': 1,
  tabIndex: -1,
} as const;

type CellProps = typeof cellStaticProps & {
  'data-field': string;
  'data-colindex': number;
  'aria-colindex': number;
};

const headerCellStaticProps = {
  role: 'columnheader',
  tabIndex: -1,
} as const;

type HeaderCellProps = typeof headerCellStaticProps & {
  'data-field': string;
  'data-colindex': number;
  'aria-colindex': number;
};

interface ElementsHooks {
  useGridProps: () => GridProps;
  useRowProps: (params: { id: GridRowId; index: number }) => RowProps;
  useCellProps: (params: { field: string; colIndex: number }) => CellProps;
  useHeaderCellProps: (params: { field: string; colIndex: number }) => HeaderCellProps;
  useContainerProps: () => ContainerProps;
  useScrollerProps: () => ScrollerProps;
  useContentProps: () => ContentProps;
  usePositionerProps: () => PositionerProps;
  useScrollbarVerticalProps: () => ScrollbarProps;
  useScrollbarHorizontalProps: () => ScrollbarProps;
  useScrollAreaProps: () => ScrollAreaProps;
}

export interface ElementsPluginState {}

export interface ElementsPluginOptions {}

export interface ElementsPluginApi {
  elements: {
    hooks: ElementsHooks;
  };
}

type ElementsPlugin = Plugin<
  'elements',
  ElementsPluginState,
  {},
  ElementsPluginApi,
  ElementsPluginOptions
>;

const elementsPlugin = createPlugin<ElementsPlugin>()({
  name: 'elements',
  initialize: (state, _params) => state,
  use: (store, _params, api) => {
    const rowIds = useStore(store, rowsPlugin.selectors.processedRowIds);
    const visibleColumns = useStore(store, columnsPlugin.selectors.visibleColumns);

    const useGridProps: ElementsHooks['useGridProps'] = () => {
      return React.useMemo((): GridProps => {
        return {
          ...gridStaticProps,
          'aria-colcount': visibleColumns.length,
          'aria-rowcount': rowIds.length + 1, // +1 for header row
        };
        // TODO: Why does it complain about exhaustive deps here?
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [visibleColumns.length, rowIds.length]);
    };

    const useRowProps: ElementsHooks['useRowProps'] = ({ id, index }) => {
      return React.useMemo(() => {
        return {
          ...rowStaticProps,
          'data-id': id,
          'data-rowindex': index,
          'aria-rowindex': index + 2, // 1-based, +1 for header row
        };
      }, [id, index]);
    };

    const useCellProps: ElementsHooks['useCellProps'] = ({ field, colIndex }) => {
      return React.useMemo(() => {
        return {
          ...cellStaticProps,
          'data-field': field,
          'data-colindex': colIndex,
          'aria-colindex': colIndex + 1, // 1-based
        };
      }, [field, colIndex]);
    };

    const useHeaderCellProps: ElementsHooks['useHeaderCellProps'] = ({ field, colIndex }) => {
      return React.useMemo(() => {
        return {
          ...headerCellStaticProps,
          'data-field': field,
          'data-colindex': colIndex,
          'aria-colindex': colIndex + 1, // 1-based
        };
      }, [field, colIndex]);
    };

    const hasVirtualization = api.pluginRegistry.hasPlugin<VirtualizationPlugin>(
      api,
      'virtualization',
    );

    const useContainerProps: ElementsHooks['useContainerProps'] = hasVirtualization
      ? () => {
          const virtualizationProps = api.virtualization.hooks.useContainerProps();
          return {
            ...containerStaticProps,
            ...virtualizationProps,
          };
        }
      : () => containerStaticProps;

    const useScrollerProps: ElementsHooks['useScrollerProps'] = hasVirtualization
      ? () => {
          const virtualizationProps = api.virtualization.hooks.useScrollerProps();
          return {
            ...scrollerStaticProps,
            ...virtualizationProps,
          };
        }
      : () => scrollerStaticProps;

    const useContentProps: ElementsHooks['useContentProps'] = hasVirtualization
      ? () => {
          const virtualizationProps = api.virtualization.hooks.useContentProps();
          return {
            ...contentStaticProps,
            ...virtualizationProps,
          };
        }
      : () => contentStaticProps;

    const usePositionerProps: ElementsHooks['usePositionerProps'] = hasVirtualization
      ? () => {
          const virtualizationProps = api.virtualization.hooks.usePositionerProps();
          return {
            ...positionerStaticProps,
            ...virtualizationProps,
          };
        }
      : () => positionerStaticProps;

    const useScrollbarVerticalProps: ElementsHooks['useScrollbarVerticalProps'] = hasVirtualization
      ? () => {
          const { scrollPosition, ...virtualizationProps } =
            api.virtualization.hooks.useScrollbarVerticalProps();
          return {
            ...scrollbarStaticProps,
            ...virtualizationProps,
          };
        }
      : () => scrollbarStaticProps;

    const useScrollbarHorizontalProps: ElementsHooks['useScrollbarHorizontalProps'] =
      hasVirtualization
        ? () => {
            const { scrollPosition, ...virtualizationProps } =
              api.virtualization.hooks.useScrollbarHorizontalProps();
            return {
              ...scrollbarStaticProps,
              ...virtualizationProps,
            };
          }
        : () => scrollbarStaticProps;

    const useScrollAreaProps: ElementsHooks['useScrollAreaProps'] = hasVirtualization
      ? () => {
          const { scrollPosition, ...virtualizationProps } =
            api.virtualization.hooks.useScrollAreaProps();
          return {
            ...scrollAreaStaticProps,
            ...virtualizationProps,
          };
        }
      : () => scrollAreaStaticProps;

    return {
      elements: {
        hooks: {
          useGridProps,
          useRowProps,
          useCellProps,
          useHeaderCellProps,
          useContainerProps,
          useScrollerProps,
          useContentProps,
          usePositionerProps,
          useScrollbarVerticalProps,
          useScrollbarHorizontalProps,
          useScrollAreaProps,
        },
      },
    };
  },
});

export default elementsPlugin;
