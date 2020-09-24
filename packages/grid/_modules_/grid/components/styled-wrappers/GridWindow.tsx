import * as React from 'react';
import { classnames } from '../../utils';
import { OptionsContext } from '../options-context';

type GridWindowProps = React.HTMLAttributes<HTMLDivElement>;

export const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
  props,
  ref,
) {
  const { className, ...other } = props;
  const { headerHeight, autoHeight } = React.useContext(OptionsContext);
  return (
    <div
      ref={ref}
      className={classnames('MuiDataGrid-window', className)}
      {...other}
      style={{ top: headerHeight, overflowY: autoHeight ? 'hidden' : 'auto' }}
    />
  );
});
