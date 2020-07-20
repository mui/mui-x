import * as React from 'react';
import { useIcons } from '../hooks/utils/useIcons';

export interface ColumnHeaderSeparatorProps {
  resizable: boolean | undefined;
  onResize?: () => void;
}

export const ColumnHeaderSeparator: React.FC<ColumnHeaderSeparatorProps> = React.memo(
  ({ onResize, resizable }) => {
    const icons = useIcons();

    const resizeIconProps = {
      className: `icon separator ${resizable ? 'resizable' : ''}`,
      ...(resizable && onResize ? { onMouseDown: onResize } : {}),
    };

    const icon = React.createElement(icons!.columnResize!, resizeIconProps);

    return <div className="column-separator">{icon}</div>;
  },
);
ColumnHeaderSeparator.displayName = 'ColumnHeaderSeparator';
