import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { LayoutDataGrid } from '@mui/x-virtualizer';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridVirtualizerContext } from '../../hooks/utils/useGridVirtualizerContext';

const useUtilityClasses = () => {
  const slots = {
    root: ['topContainer'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

const Element = styled('div', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
  position: 'sticky',
  zIndex: 40,
  top: 0,
});

export function GridTopContainer(props: React.PropsWithChildren) {
  const classes = useUtilityClasses();
  const virtualizer = useGridVirtualizerContext();
  const containerVerticalProps = virtualizer.store.use(LayoutDataGrid.selectors.containerVerticalProps);

  return (
    <Element
      {...containerVerticalProps}
      {...props}
      className={clsx(classes.root, gridClasses['container--top'])}
      role="presentation"
    />
  );
}
