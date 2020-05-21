import React from 'react';

import { RowId } from '../models';
import { ROW_CSS_CLASS } from '../constants/cssClassesConstants';

export interface RowProps {
  id: RowId;
  selected: boolean;
  className: string;
  rowIndex: number;
}

export const Row: React.FC<RowProps> = React.memo(({ selected, id, className, rowIndex, children }) => {
  const cssClasses = (selected ? 'selected ' : ' ') + (className || '');

  const ariaRowIndex = rowIndex + 2; //1 for the header row and 1 as it's 1 based
  return (
    <div
      key={id}
      data-id={id}
      data-rowindex={rowIndex}
      role={'row'}
      className={`${ROW_CSS_CLASS} ${cssClasses}`}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
    >
      {children}
    </div>
  );
});

Row.displayName = 'Row';
