import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  useVirtualizer,
  LayoutList,
  LayoutListSticky,
  LayoutGridSticky,
  LayoutDataGrid,
  Virtualization,
  Dimensions,
  type Virtualizer,
  type VirtualizerParams,
} from '@mui/x-virtualizer';

export type DemoLayout = 'list' | 'sticky-list' | 'sticky-grid' | 'grid' | 'controlled-grid';

const getAutoRowHeight = () => 'auto' as const;

export interface ScrollContainerGridProps {
  layout?: DemoLayout;
  scrollContainer?: VirtualizerParams['scrollContainer'];
  axes?: 'vertical' | 'both';
  insets?: VirtualizerParams['scrollViewportInsets'];
  rowCount?: number;
  columnCount?: number;
  pinned?: boolean;
  rtl?: boolean;
  variableHeight?: boolean;
  autoRowHeight?: boolean;
  scrollbarSize?: number;
  apiRef?: React.Ref<Virtualizer>;
  initialScroll?: { top: number; left: number };
  focusedCell?: VirtualizerParams['focusedVirtualCell'];
  onScrollChange?: VirtualizerParams['onScrollChange'];
  onRenderContextChange?: VirtualizerParams['onRenderContextChange'];
  scrollReset?: VirtualizerParams['scrollReset'];
}

/** Each renderer uses its layout's selectors and DOM contract. */
export function ScrollContainerGrid(props: ScrollContainerGridProps) {
  const {
    layout: layoutName = 'sticky-grid',
    scrollContainer = 'self',
    axes = 'vertical',
    rowCount = 10000,
    columnCount = 40,
    pinned = true,
    rtl = false,
    variableHeight = false,
  } = props;
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
    scrollbarVertical: React.useRef<HTMLDivElement>(null),
    scrollbarHorizontal: React.useRef<HTMLDivElement>(null),
  };
  const layout = useLazyRef(() => {
    switch (layoutName) {
      case 'list':
        return new LayoutList(refs);
      case 'sticky-list':
        return new LayoutListSticky(refs);
      case 'sticky-grid':
        return new LayoutGridSticky(refs);
      default:
        return new LayoutDataGrid(refs);
    }
  }).current;
  const columns = React.useMemo(
    () =>
      Array.from({ length: columnCount }, (_, index) => ({
        field: `column-${index}`,
        computedWidth: 120,
      })),
    [columnCount],
  );
  const rows = React.useMemo(
    () => Array.from({ length: rowCount }, (_, id) => ({ id, model: {} })),
    [rowCount],
  );
  const pinnedRows = React.useMemo(
    () =>
      pinned
        ? { top: [{ id: 'top', model: {} }], bottom: [{ id: 'bottom', model: {} }] }
        : undefined,
    [pinned],
  );
  const pinnedColumns = React.useMemo(
    () => (pinned ? { left: [columns[0]], right: [columns[columnCount - 1]] } : undefined),
    [columns, columnCount, pinned],
  );
  const rowHeight = React.useCallback(
    (row: { id: number | string }) =>
      variableHeight && typeof row.id === 'number' && row.id % 3 === 0 ? 72 : 40,
    [variableHeight],
  );
  const virtualizer = useVirtualizer({
    layout,
    scrollContainer,
    scrollContainerAxes: axes,
    scrollViewportInsets: props.insets,
    initialState: { scroll: props.initialScroll },
    dimensions: {
      rowHeight: 40,
      scrollbarSize: props.scrollbarSize,
      columnsTotalWidth: columnCount * 120,
      topPinnedHeight: 40,
      leftPinnedWidth: pinned ? 120 : 0,
      rightPinnedWidth: pinned ? 120 : 0,
    },
    virtualization: {
      isRtl: rtl,
      layoutMode: layoutName === 'controlled-grid' ? 'controlled' : undefined,
      ...(layoutName.startsWith('sticky') ? { layoutMode: 'sticky' } : undefined),
    },
    rows,
    rowCount,
    range: { firstRowIndex: 0, lastRowIndex: rowCount },
    columns,
    pinnedRows,
    pinnedColumns,
    getRowHeight: props.autoRowHeight ? getAutoRowHeight : rowHeight,
    focusedVirtualCell: props.focusedCell,
    onScrollChange: props.onScrollChange,
    scrollReset: props.scrollReset,
    renderRow: (row) => (
      <DemoRow
        key={row.id}
        id={row.id}
        first={row.firstColumnIndex}
        last={row.lastColumnIndex}
        columnCount={columnCount}
        pinned={pinned}
        compact={layoutName === 'sticky-grid'}
        controlled={layoutName === 'controlled-grid' && scrollContainer === 'self'}
        rtl={rtl}
        height={rowHeight(row)}
        observe={props.autoRowHeight ? virtualizer.api.rowsMeta.observeRowHeight : undefined}
        virtualFocus={row.isVirtualFocusRow}
      />
    ),
  });
  React.useImperativeHandle(props.apiRef, () => virtualizer);
  const context = virtualizer.store.use(Virtualization.selectors.renderContext);
  const { onRenderContextChange } = props;
  React.useEffect(() => {
    onRenderContextChange?.(context);
  }, [onRenderContextChange, context]);
  const header = (
    <React.Fragment>
      <DemoRow
        id="header"
        first={context.firstColumnIndex}
        last={context.lastColumnIndex}
        columnCount={columnCount}
        pinned={pinned}
        rtl={rtl}
        height={40}
        compact={layoutName === 'sticky-grid'}
        controlled={layoutName === 'controlled-grid' && scrollContainer === 'self'}
      />
      {virtualizer.api.getters.getRows({ position: 'top', rows: pinnedRows?.top ?? [] })}
    </React.Fragment>
  );
  const footer = virtualizer.api.getters.getRows({
    position: 'bottom',
    rows: pinnedRows?.bottom ?? [],
  });
  const rendererProps = { virtualizer, header, footer, rtl, columns };
  if (layoutName === 'list' || layoutName === 'sticky-list') {
    return <ListRenderer {...rendererProps} sticky={layoutName === 'sticky-list'} />;
  }
  if (layoutName === 'sticky-grid') {
    return <StickyGridRenderer {...rendererProps} />;
  }
  return <DataGridRenderer {...rendererProps} />;
}

type RendererProps = {
  virtualizer: Virtualizer;
  header: React.ReactNode;
  footer: React.ReactNode;
  rtl: boolean;
  columns: { field: string; computedWidth: number }[];
};

const externalSelector = (state: Virtualizer['store']['state']) => state.scrolling.external;
const splitSelector = (state: Virtualizer['store']['state']) =>
  state.scrolling.external && !state.scrolling.bothAxes;
const rootStyle = {
  background: '#fff',
  color: '#111',
  font: '13px monospace',
  position: 'relative',
} as const;

type BandSelectors = Pick<
  typeof LayoutList.selectors,
  'headerScrollerProps' | 'footerScrollerProps' | 'bodyScrollerProps' | 'scrollCanvasProps'
>;

function Band({
  virtualizer,
  selectors,
  position,
  children,
}: {
  virtualizer: Virtualizer;
  selectors: BandSelectors;
  position: 'header' | 'body' | 'footer';
  children: React.ReactNode;
}) {
  const split = virtualizer.store.use(splitSelector);
  const scroller = virtualizer.store.use(selectors[`${position}ScrollerProps`]);
  const canvas = virtualizer.store.use(selectors.scrollCanvasProps);
  if (!split) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <div {...scroller} data-testid={`${position}-scroller`}>
      <div {...canvas}>{children}</div>
    </div>
  );
}

function HorizontalScrollbar({
  virtualizer,
  selectors,
}: {
  virtualizer: Virtualizer;
  selectors: {
    scrollbarHorizontalProps: (state: Virtualizer['store']['state']) => {
      ref?: React.Ref<HTMLDivElement>;
      style?: React.CSSProperties;
    };
    scrollbarContentProps: typeof LayoutList.selectors.scrollbarContentProps;
  };
}) {
  const { ref, style } = virtualizer.store.use(selectors.scrollbarHorizontalProps);
  const content = virtualizer.store.use(selectors.scrollbarContentProps);
  return (
    <div
      ref={ref}
      style={
        style ?? {
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 14,
          overflowX: 'auto',
          overflowY: 'hidden',
        }
      }
      data-testid="horizontal-scrollbar"
    >
      <div {...content} />
    </div>
  );
}

function ListRenderer({
  virtualizer,
  header,
  footer,
  rtl,
  sticky,
}: RendererProps & { sticky: boolean }) {
  const selectors = sticky ? LayoutListSticky.selectors : LayoutList.selectors;
  const container = virtualizer.store.use(selectors.containerProps);
  const content = virtualizer.store.use(selectors.contentProps);
  const positioner = virtualizer.store.use(selectors.positionerProps);
  const windowProps = virtualizer.store.use(LayoutListSticky.selectors.windowProps);
  const rowsProps = virtualizer.store.use(LayoutListSticky.selectors.windowContentProps);
  const top = virtualizer.store.use(selectors.topContainerProps);
  const bottom = virtualizer.store.use(selectors.bottomContainerProps);
  const remaining = virtualizer.store.use(selectors.spacerBottomProps);
  const external = virtualizer.store.use(externalSelector);
  const dimensions = virtualizer.store.use(Dimensions.selectors.dimensions);
  const bands = dimensions.topContainerHeight + dimensions.bottomContainerHeight;
  const contents = (
    <React.Fragment>
      <div {...top} data-testid="header">
        <Band virtualizer={virtualizer} selectors={selectors} position="header">
          {header}
        </Band>
      </div>
      <div
        {...positioner}
        style={{
          ...positioner.style,
          ...(!external && !sticky
            ? {
                height: Math.max(
                  0,
                  Number(positioner.style.height) - dimensions.topContainerHeight,
                ),
              }
            : undefined),
        }}
      />
      <div
        {...(sticky ? windowProps : undefined)}
        data-testid="render-window"
        style={
          sticky
            ? {
                ...windowProps.style,
                ...(!external
                  ? {
                      top: Number(windowProps.style.top) + dimensions.topContainerHeight,
                      bottom: Number(windowProps.style.bottom) + dimensions.bottomContainerHeight,
                    }
                  : undefined),
              }
            : undefined
        }
      >
        <Band virtualizer={virtualizer} selectors={selectors} position="body">
          <div {...(sticky ? rowsProps : undefined)}>{virtualizer.api.getters.getRows()}</div>
        </Band>
      </div>
      <div {...remaining} />
      <div {...bottom} data-testid="footer">
        <Band virtualizer={virtualizer} selectors={selectors} position="footer">
          {footer}
        </Band>
      </div>
    </React.Fragment>
  );
  const contentStyle = {
    ...content.style,
    ...(!external ? { height: dimensions.contentSize.height + bands } : undefined),
  };
  return (
    <div
      {...container}
      role="grid"
      data-testid="grid"
      dir={rtl ? 'rtl' : 'ltr'}
      style={{
        ...rootStyle,
        ...container.style,
        overflowX: external ? 'visible' : (container.style.overflowX ?? 'auto'),
        overflowY: external ? 'visible' : (container.style.overflowY ?? 'auto'),
        ...(!external ? { height: 400 } : undefined),
      }}
    >
      {sticky ? (
        <div {...content} style={contentStyle}>
          {contents}
        </div>
      ) : (
        <React.Fragment>
          <div {...content} style={contentStyle} />
          {contents}
        </React.Fragment>
      )}
      <HorizontalScrollbar virtualizer={virtualizer} selectors={selectors} />
    </div>
  );
}

function StickyGridRenderer({ virtualizer, header, footer, rtl, columns }: RendererProps) {
  const selectors = LayoutGridSticky.selectors;
  const container = virtualizer.store.use(selectors.containerProps);
  const scroller = virtualizer.store.use(selectors.scrollerProps);
  const content = virtualizer.store.use(selectors.contentProps);
  const top = virtualizer.store.use(selectors.topContainerProps);
  const bottom = virtualizer.store.use(selectors.bottomContainerProps);
  const spacerTop = virtualizer.store.use(selectors.spacerTopProps);
  const spacerBottom = virtualizer.store.use(selectors.spacerBottomProps);
  const spacerLeft = virtualizer.store.use(selectors.spacerLeftProps, columns);
  const innerContainer = virtualizer.store.use(selectors.innerContainerProps, columns);
  const windowProps = virtualizer.store.use(selectors.windowProps);
  const innerWindow = virtualizer.store.use(selectors.innerWindowProps, columns);
  const rowsProps = virtualizer.store.use(selectors.windowContentProps);
  const external = virtualizer.store.use(externalSelector);
  return (
    <div
      {...container}
      role="grid"
      data-testid="grid"
      dir={rtl ? 'rtl' : 'ltr'}
      style={{ ...rootStyle, ...container.style, ...(!external ? { height: 400 } : undefined) }}
    >
      <div {...scroller}>
        <div {...content}>
          <div {...top} data-testid="header">
            <Band virtualizer={virtualizer} selectors={selectors} position="header">
              <div {...spacerLeft} />
              <div {...innerContainer}>{header}</div>
            </Band>
          </div>
          <div {...spacerTop} />
          <div {...windowProps} data-testid="render-window">
            <Band virtualizer={virtualizer} selectors={selectors} position="body">
              <div {...spacerLeft} />
              <div {...innerWindow}>
                <div {...rowsProps}>{virtualizer.api.getters.getRows()}</div>
              </div>
            </Band>
          </div>
          <div {...spacerBottom} />
          <div {...bottom} data-testid="footer">
            <Band virtualizer={virtualizer} selectors={selectors} position="footer">
              <div {...spacerLeft} />
              <div {...innerContainer}>{footer}</div>
            </Band>
          </div>
        </div>
      </div>
      <HorizontalScrollbar virtualizer={virtualizer} selectors={selectors} />
    </div>
  );
}

const controlledHorizontalOffset = (state: Virtualizer['store']['state']) =>
  !state.scrolling.external && state.virtualization.layoutMode === 'controlled'
    ? Math.abs(state.virtualization.scrollPosition.current.left)
    : 0;

function DataGridRenderer({ virtualizer, header, footer, rtl }: RendererProps) {
  const selectors = LayoutDataGrid.selectors;
  const container = virtualizer.store.use(selectors.containerProps);
  const scroller = virtualizer.store.use(selectors.scrollerProps);
  const scrollerContent = virtualizer.store.use(selectors.scrollerContentProps);
  const viewport = virtualizer.store.use(selectors.viewportProps);
  const body = virtualizer.store.use(selectors.bodyProps);
  const content = virtualizer.store.use(selectors.contentProps);
  const positioner = virtualizer.store.use(selectors.positionerProps);
  const top = virtualizer.store.use(selectors.topContainerProps);
  const bottom = virtualizer.store.use(selectors.bottomContainerProps);
  const vertical = virtualizer.store.use(selectors.containerVerticalProps);
  const external = virtualizer.store.use(externalSelector);
  const mode = virtualizer.store.use(Virtualization.selectors.layoutMode);
  const controlled = mode === 'controlled';
  const pinnedOffset = virtualizer.store.use(controlledHorizontalOffset);
  const dimensions = virtualizer.store.use(Dimensions.selectors.dimensions);
  return (
    <div
      {...container}
      role="grid"
      data-testid="grid"
      dir={rtl ? 'rtl' : 'ltr'}
      style={
        {
          ...rootStyle,
          ...container.style,
          ...(!external ? { height: 400 } : undefined),
          '--demo-pinned-start': `${pinnedOffset}px`,
          '--demo-pinned-end': `${Math.max(0, dimensions.columnsTotalWidth - dimensions.viewportInnerSize.width - pinnedOffset)}px`,
        } as React.CSSProperties
      }
    >
      <div
        {...scroller}
        style={{
          position: 'relative',
          height: '100%',
          ...scroller.style,
          overflowX: external ? 'visible' : (scroller.style.overflowX ?? 'auto'),
          overflowY: external ? 'visible' : (scroller.style.overflowY ?? 'auto'),
        }}
      >
        <div {...scrollerContent}>
          <div
            {...viewport}
            data-testid="render-window"
            style={
              {
                display: controlled ? 'block' : 'contents',
                ...(controlled
                  ? ({ position: 'sticky', top: 0, left: 0, right: 0, overflow: 'hidden' } as const)
                  : undefined),
                ...viewport.style,
              } as React.CSSProperties
            }
          >
            <div {...top} data-testid="header" style={{ ...top.style, ...vertical?.style }}>
              <Band virtualizer={virtualizer} selectors={selectors} position="header">
                {header}
              </Band>
            </div>
            <div {...body}>
              <Band virtualizer={virtualizer} selectors={selectors} position="body">
                <div
                  {...positioner}
                  style={{
                    position: 'absolute',
                    top: !external && controlled ? dimensions.topContainerHeight : 0,
                    width: '100%',
                    ...positioner.style,
                  }}
                >
                  {virtualizer.api.getters.getRows()}
                </div>
                {!controlled && <div {...content} />}
              </Band>
            </div>
            <div
              {...bottom}
              data-testid="footer"
              style={{
                ...bottom.style,
                ...vertical?.style,
                ...(controlled
                  ? ({ position: 'absolute', bottom: 0, width: '100%' } as const)
                  : undefined),
              }}
            >
              <Band virtualizer={virtualizer} selectors={selectors} position="footer">
                {footer}
              </Band>
            </div>
          </div>
        </div>
      </div>
      <HorizontalScrollbar virtualizer={virtualizer} selectors={selectors} />
    </div>
  );
}

function DemoRow(props: {
  id: number | string;
  first: number;
  last: number;
  columnCount: number;
  pinned: boolean;
  compact?: boolean;
  controlled?: boolean;
  rtl: boolean;
  height: number;
  virtualFocus?: boolean;
  observe?: Virtualizer['api']['rowsMeta']['observeRowHeight'];
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { id, first, last, columnCount, pinned, rtl, observe } = props;
  React.useEffect(
    () => (observe && ref.current ? observe(ref.current, id) : undefined),
    [observe, id],
  );
  const startInset = props.controlled
    ? 'var(--demo-pinned-start)'
    : `var(--virtualizer-pinned-${rtl ? 'right' : 'left'}, 0px)`;
  const endInset = props.controlled
    ? 'var(--demo-pinned-end)'
    : `var(--virtualizer-pinned-${rtl ? 'left' : 'right'}, 0px)`;
  const cell = (index: number, pin?: 'start' | 'end') => (
    <div
      key={index}
      data-column={index}
      data-pinned={pin}
      style={{
        flex: '0 0 120px',
        width: 120,
        boxSizing: 'border-box',
        padding: 8,
        borderInlineEnd: '1px solid #ddd',
        overflow: 'hidden',
        position: pin ? 'sticky' : undefined,
        ...(pin && props.controlled
          ? { position: 'absolute' as const, height: '100%' }
          : undefined),
        insetInlineStart: pin === 'start' ? startInset : undefined,
        insetInlineEnd: pin === 'end' ? endInset : undefined,
        background: pin || typeof id === 'string' ? '#eee' : '#fff',
        zIndex: pin ? 1 : undefined,
      }}
    >
      {id} × {index}
    </div>
  );
  return (
    <div
      ref={ref}
      data-row={typeof id === 'number' ? id : undefined}
      data-band={typeof id === 'string' ? id : undefined}
      style={{
        display: 'flex',
        position: 'relative',
        width: props.compact ? '100%' : columnCount * 120,
        height: props.virtualFocus ? 0 : props.height,
        overflow: props.virtualFocus ? 'hidden' : undefined,
        boxSizing: 'border-box',
        borderBottom: '1px solid #ddd',
      }}
    >
      {pinned && cell(0, 'start')}
      {!props.compact && (
        <div
          style={{
            flex: `0 0 ${Math.max(0, first - (pinned && !props.controlled ? 1 : 0)) * 120}px`,
          }}
        />
      )}
      {Array.from({ length: Math.max(0, last - first) }, (_, i) => cell(first + i))}
      {!props.compact && (
        <div
          style={{ flex: `0 0 ${Math.max(0, columnCount - last - (pinned ? 1 : 0)) * 120}px` }}
        />
      )}
      {pinned && cell(columnCount - 1, 'end')}
    </div>
  );
}
