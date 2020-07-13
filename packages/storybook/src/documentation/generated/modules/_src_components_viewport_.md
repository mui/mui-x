[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/viewport"](_src_components_viewport_.md)

# Module: "src/components/viewport"

## Index

### Interfaces

- [ViewportProps](../interfaces/_src_components_viewport_.viewportprops.md)

### Type aliases

- [ViewportType](_src_components_viewport_.md#viewporttype)

### Variables

- [Viewport](_src_components_viewport_.md#const-viewport)

## Type aliases

### ViewportType

Ƭ **ViewportType**: _ForwardRefExoticComponent‹[ViewportProps](../interfaces/_src_components_viewport_.viewportprops.md) & RefAttributes‹HTMLDivElement››_

_Defined in [packages/grid/x-grid-modules/src/components/viewport.tsx:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/viewport.tsx#L19)_

## Variables

### `Const` Viewport

• **Viewport**: _[ViewportType](_src_components_viewport_.md#viewporttype)_ = React.forwardRef<HTMLDivElement, ViewportProps>(
({ options, rows, visibleColumns, children }, renderingZoneRef) => {
const logger = useLogger('Viewport');
const renderCtx = useContext(RenderContext) as RenderContextProps;

    const getRowsElements = () => {
      const renderedRows = rows.slice(renderCtx.firstRowIdx, renderCtx.lastRowIdx!);
      return renderedRows.map((r, idx) => (
        <Row
          className={(renderCtx.firstRowIdx! + idx) % 2 === 0 ? 'even' : 'odd'}
          key={r.id}
          id={r.id}
          selected={r.selected}
          rowIndex={renderCtx.firstRowIdx + idx}
        >
          <LeftEmptyCell key={'left-empty'} width={renderCtx.leftEmptyWidth} />
          <RowCells
            columns={visibleColumns}
            row={r}
            firstColIdx={renderCtx.firstColIdx}
            lastColIdx={renderCtx.lastColIdx}
            hasScroll={{ y: renderCtx.hasScrollY, x: renderCtx.hasScrollX }}
            scrollSize={renderCtx.scrollBarSize}
            showCellRightBorder={options.showCellRightBorder}
            extendRowFullWidth={options.extendRowFullWidth}
            rowIndex={renderCtx.firstRowIdx + idx}
            domIndex={idx}
          />
          <RightEmptyCell key={'right-empty'} width={renderCtx.rightEmptyWidth} />
        </Row>
      ));
    };

    logger.debug('Rendering ViewPort');
    return (
      <StickyContainer {...renderCtx.viewportSize}>
        <RenderingZone ref={renderingZoneRef} {...renderCtx.renderingZone}>
          {getRowsElements()}
        </RenderingZone>
      </StickyContainer>
    );

},
)

_Defined in [packages/grid/x-grid-modules/src/components/viewport.tsx:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/viewport.tsx#L20)_
