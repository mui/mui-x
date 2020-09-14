import * as React from 'react';
import { classnames } from '../../utils';
import { OptionsContext } from '../options-context';

type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export function GridOverlay(props: GridOverlayProps) {
  const { className, children, ...other } = props;
  const options = React.useContext(OptionsContext);
  return (
    <div
      className={classnames('MuiDataGrid-overlay', className)}
      {...other}
      style={{ top: options?.headerHeight }}
    >
      <div className="MuiDataGrid-overlayContent">{children}</div>
    </div>
  );
}
