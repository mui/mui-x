import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';

const useUtilityClasses = () => {
  const slots = {
    root: ['bottomContainer'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

const StyledDiv = styled('div', {
  name: 'MuiDataGrid',
  slot: 'BottomContainer',
  overridesResolver: (_props, styles) => styles.bottomContainer ?? {},
})({
  position: 'sticky',
  bottom: 0,
  zIndex: 2,
});

export const GridBottomContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridBottomContainer(props, ref) {
  const classes = useUtilityClasses();

  return (
    <StyledDiv
      ref={ref}
      {...props}
      className={clsx(classes.root, props.className, gridClasses['container--bottom'])}
      role="presentation"
    />
  );
});
