import React from 'react';

import { RowId } from '../models';
import { ROW_CSS_CLASS } from '../constants/cssClassesConstants';

export interface RowProps {
  id: RowId;
  selected: boolean;
  className: string;
}

export const Row: React.FC<RowProps> = React.memo(({ selected, id, className, children }) => {
  const cssClasses = (selected ? 'selected ' : ' ') + (className || '');
  return (
    <div key={id} data-id={id} role={'row'} className={`${ROW_CSS_CLASS} ${cssClasses}`}>
      {children}
    </div>
  );
});

Row.displayName = 'Row';
