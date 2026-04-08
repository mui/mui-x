import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { LayoutDataGrid } from '@mui/x-virtualizer';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridVirtualizerContext } from '../../hooks/utils/useGridVirtualizerContext';

const useUtilityClasses = () => {
  const slots = {
    root: ['bottomContainer'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

export type GridBottomContainerProps = React.PropsWithChildren;

const Element = styled('div', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
  position: 'sticky',
  zIndex: 40,
  bottom: 'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
  [`.${gridClasses['virtualizer--layoutControlled']} &`]: {
    position: 'absolute',
  },
});

export function GridBottomContainer(props: GridBottomContainerProps) {
  const classes = useUtilityClasses();
  const virtualizer = useGridVirtualizerContext();
  const containerVerticalProps = virtualizer.store.use(LayoutDataGrid.selectors.containerVerticalProps);

  return (
    <Element
      {...containerVerticalProps}
      {...props}
      className={clsx(classes.root, gridClasses['container--bottom'])}
      role="presentation"
    />
  );
}
