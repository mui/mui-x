import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';

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
  width: '100%',
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
      className={clsx(classes.root, props.className, gridClasses['container--top'])}
      role="presentation"
    />
  );
});
