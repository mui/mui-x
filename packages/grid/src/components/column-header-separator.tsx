import React from 'react';
import SeparatorIcon from '@material-ui/icons/Remove';

export interface ColumnHeaderSeparatorProps {
  resizable: boolean | undefined;
  onResize?: () => void;
}

export const ColumnHeaderSeparator: React.FC<ColumnHeaderSeparatorProps> = React.memo(({ onResize, resizable }) => {
  return (
    <div className={'column-separator'}>
      <SeparatorIcon
        fontSize={'default'}
        className={'icon separator ' + (resizable ? 'resizable' : '')}
        {...(resizable && onResize ? { onMouseDown: onResize } : {})}
      />
    </div>
  );
});
