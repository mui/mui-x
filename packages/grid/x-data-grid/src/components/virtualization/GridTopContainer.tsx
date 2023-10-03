import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

const useUtilityClasses = () => {
  const slots = {
    root: ['topContainer'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

const StyledDiv = styled('div', {
  name: 'MuiDataGrid',
  slot: 'TopContainer',
  overridesResolver: (_props, styles) => styles.topContainer,
})({
  position: 'sticky',
  top: 0,
  zIndex: 2,
  // FIXME: remove
  background: 'rgba(127, 127, 127, 0.5)',
});

export const GridTopContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridTopContainer(props, ref) {
  const classes = useUtilityClasses();

  return (
    <StyledDiv
      ref={ref}
      {...props}
      className={clsx(classes.root, props.className)}
      role="presentation"
    />
  );
});
