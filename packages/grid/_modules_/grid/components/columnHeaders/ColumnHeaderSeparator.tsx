import * as React from 'react';
import { useIcons } from '../../hooks/utils/useIcons';
import { classnames } from '../../utils/index';
import { OptionsContext } from '../options-context';

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

  const stopClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={classnames('MuiDataGrid-columnSeparator', {
        'MuiDataGrid-columnSeparatorResizable': resizable,
        'Mui-resizing': resizing,
      })}
      style={{ minHeight: height, opacity: showColumnRightBorder ? 0 : 1 }}
      {...other}
      onClick={stopClick}
    >
      <Icon className="MuiDataGrid-iconSeparator" />
    </div>
  );
});
