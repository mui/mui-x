import * as React from 'react';
import { useIcons } from '../hooks/utils/useIcons';
import { OptionsContext } from './options-context';

export interface ColumnHeaderSeparatorProps {
  resizable: boolean | undefined;
  onResize?: () => void;
}

export const ColumnHeaderSeparator: React.FC<ColumnHeaderSeparatorProps> = React.memo(
  ({ onResize, resizable }) => {
    const icons = useIcons();
    const { showColumnRightBorder, headerHeight } = React.useContext(OptionsContext);

    const resizeIconProps = {
      className: `MuiDataGrid-iconSeparator ${resizable ? 'MuiDataGrid-resizable' : ''}`,
      ...(resizable && onResize ? { onMouseDown: onResize } : {}),
    };

    const icon = React.createElement(icons!.columnResize!, resizeIconProps);

    return (
      <div
        className="MuiDataGrid-columnSeparator"
        style={{ minHeight: headerHeight, opacity: showColumnRightBorder ? 0 : 1 }}
      >
        {icon}
      </div>
    );
  },
);
ColumnHeaderSeparator.displayName = 'ColumnHeaderSeparator';
