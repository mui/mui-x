import * as React from 'react';
import { useIcons } from '../hooks/utils/useIcons';
import { classnames } from '../utils';
import { OptionsContext } from './options-context';

export interface ColumnHeaderSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  resizable: boolean;
  resizing: boolean;
}

export const ColumnHeaderSeparator = React.memo(function ColumnHeaderSeparator(
  props: ColumnHeaderSeparatorProps,
) {
  const { resizable, resizing, ...other } = props;
  const icons = useIcons();
  const { showColumnRightBorder, headerHeight } = React.useContext(OptionsContext);
  const Icon = icons!.columnResize!;

  return (
    <div
      className={classnames('MuiDataGrid-columnSeparator', {
        'MuiDataGrid-columnSeparatorResizable': resizable,
        'Mui-resizing': resizing,
      })}
      style={{ minHeight: headerHeight, opacity: showColumnRightBorder ? 0 : 1 }}
      {...other}
    >
      <Icon className="MuiDataGrid-iconSeparator" />
    </div>
  );
});
