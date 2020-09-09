import * as React from 'react';
import { DivProps } from './grid-root';
import { classnames } from '../../utils';
import { OptionsContext } from '../options-context';

export const Window = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { headerHeight, autoHeight } = React.useContext(OptionsContext);
  const { className, ...other } = props;
  return (
    <div
      ref={ref}
      className={classnames('MuiDataGrid-window', className)}
      {...other}
      style={{ top: headerHeight, overflowY: autoHeight ? 'hidden' : 'auto' }}
    />
  );
});
Window.displayName = 'Window';
