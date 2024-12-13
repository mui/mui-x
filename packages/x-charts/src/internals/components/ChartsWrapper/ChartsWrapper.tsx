import * as React from 'react';
import { styled } from '@mui/material/styles';

type ChartsWrapperProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  direction: 'horizontal' | 'vertical';
  children: React.ReactNode;
};

const Root = styled('div', {
  name: 'MuiChartsWrapper',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsWrapperProps }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: ownerState.direction === 'vertical' ? 'row' : 'column',
}));

/**
 * @ignore - internal component.
 *
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props: ChartsWrapperProps) {
  const { children } = props;

  return <Root ownerState={props}>{children}</Root>;
}

export { ChartsWrapper };
