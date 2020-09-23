import * as React from 'react';
import { classnames } from '../../utils';
import { OptionsContext } from '../options-context';

type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export function GridOverlay(props: GridOverlayProps) {
  const { className, style, ...other } = props;
  const options = React.useContext(OptionsContext);
  return (
    <div
      className={classnames('MuiDataGrid-overlay', className)}
      style={{ top: options?.headerHeight, ...style }}
      {...other}
    />
  );
}
