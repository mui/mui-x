import * as React from 'react';
import { classnames } from '../../utils';
import { DivProps } from './grid-root';
import { OptionsContext } from '../options-context';

export function GridOverlay(props: DivProps) {
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
GridOverlay.displayName = 'GridOverlay';
