import * as React from 'react';
import clsx from 'clsx';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import { styled } from '@mui/material/styles';
import { getMuiVersion } from '../../utils/utils';

const GridPanelWrapperRoot = styled('div', {
  name: 'MuiGridPanelWrapper',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  '&:focus': {
    outline: 0,
  },
});

const isEnabled = () => true;

export function GridPanelWrapper(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const { className, ...other } = props;
  const extraProps = getMuiVersion().startsWith('v4')
    ? {
        getDoc: () => document,
      }
    : ({} as any);

  return (
    <TrapFocus open disableEnforceFocus isEnabled={isEnabled} {...extraProps}>
      <GridPanelWrapperRoot
        tabIndex={-1}
        className={clsx('MuiGridPanelWrapper-root', className)}
        {...other}
      />
    </TrapFocus>
  );
}
