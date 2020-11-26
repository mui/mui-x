import * as React from 'react';
import { useIcons } from '../hooks/utils/useIcons';
import { classnames } from '../utils';
import { OptionsContext } from './options-context';

export interface ColumnHeaderSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  resizable: boolean;
  resizing: boolean;
  height: number;
}

export const ColumnHeaderSeparator = React.memo(function ColumnHeaderSeparator(
  props: ColumnHeaderSeparatorProps,
) {
  const { resizable, resizing, height, ...other } = props;
  const icons = useIcons();
  const { showColumnRightBorder } = React.useContext(OptionsContext);
  const Icon = icons!.ColumnResize!;

  return (
    <div
      className={classnames('MuiDataGrid-columnSeparator', {
        'MuiDataGrid-columnSeparatorResizable': resizable,
        'Mui-resizing': resizing,
      })}
      style={{ minHeight: height, opacity: showColumnRightBorder ? 0 : 1 }}
      {...other}
    >
      <Icon className="MuiDataGrid-iconSeparator" />
    </div>
  );
});
