import * as React from 'react';
import { styled } from '@mui/system';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';

const GridPanelAnchor = styled('div')({
  position: 'absolute',
  top: `var(--DataGrid-headersTotalHeight)`,
  left: 0,
  width: 'calc(100% - (var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize)))',
});

type OwnerState = DataGridProcessedProps;

const Element = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Main',
  overridesResolver: (props, styles) => styles.main,
})<{ ownerState: OwnerState }>({
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const GridMainContainer = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className: string;
  }>
>((props, ref) => {
  const rootProps = useGridRootProps();
  const configuration = useGridConfiguration();
  const ariaAttributes = configuration.hooks.useGridAriaAttributes();

  return (
    <Element
      ref={ref}
      ownerState={rootProps}
      className={props.className}
      tabIndex={-1}
      {...ariaAttributes}
      {...rootProps.slotProps?.main}
    >
      <GridPanelAnchor role="presentation" data-id="gridPanelAnchor" />
      {props.children}
    </Element>
  );
});
