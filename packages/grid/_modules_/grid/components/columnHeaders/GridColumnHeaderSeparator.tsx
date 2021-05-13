import * as React from 'react';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';

export interface GridColumnHeaderSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  resizable: boolean;
  resizing: boolean;
  height: number;
}

export const GridColumnHeaderSeparator = React.memo(function GridColumnHeaderSeparator(
  props: GridColumnHeaderSeparatorProps,
) {
  const { resizable, resizing, height, ...other } = props;
  const apiRef = React.useContext(GridApiContext);
  const { showColumnRightBorder } = useGridSelector(apiRef, optionsSelector);
  const ColumnResizeIcon = apiRef!.current.components!.ColumnResizeIcon!;

  const stopClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={clsx('MuiDataGrid-columnSeparator', {
        'MuiDataGrid-columnSeparatorResizable': resizable,
        'Mui-resizing': resizing,
      })}
      style={{ minHeight: height, opacity: showColumnRightBorder ? 0 : 1 }}
      {...other}
      onClick={stopClick}
    >
      <ColumnResizeIcon className="MuiDataGrid-iconSeparator" />
    </div>
  );
});
