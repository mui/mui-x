import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../constants';

const classes = {
  root: gridClasses.scrollbarFiller,
  header: gridClasses['scrollbarFiller--header'],
  borderTop: gridClasses['scrollbarFiller--borderTop'],
  borderBottom: gridClasses['scrollbarFiller--borderBottom'],
  pinnedRight: gridClasses['scrollbarFiller--pinnedRight'],
};

function GridScrollbarFillerCell({
  header,
  borderTop = true,
  borderBottom,
  pinnedRight,
}: {
  header?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  pinnedRight?: boolean;
}) {
  return (
    <div
      role="presentation"
      className={clsx(
        classes.root,
        header && classes.header,
        borderTop && classes.borderTop,
        borderBottom && classes.borderBottom,
        pinnedRight && classes.pinnedRight,
      )}
    />
  );
}

export { GridScrollbarFillerCell };
