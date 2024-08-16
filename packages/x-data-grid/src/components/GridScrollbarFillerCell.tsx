import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../constants';

const classes = {
  root: gridClasses.scrollbarFiller,
  header: gridClasses['scrollbarFiller--header'],
  borderTop: gridClasses['scrollbarFiller--borderTop'],
  pinnedRight: gridClasses['scrollbarFiller--pinnedRight'],
};

function GridScrollbarFillerCell({
  header,
  borderTop = true,
  pinnedRight,
}: {
  header?: boolean;
  borderTop?: boolean;
  pinnedRight?: boolean;
}) {
  return (
    <div
      role="presentation"
      className={clsx(
        classes.root,
        header && classes.header,
        borderTop && classes.borderTop,
        pinnedRight && classes.pinnedRight,
      )}
    />
  );
}

export { GridScrollbarFillerCell };
