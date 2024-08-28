import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../constants';

const classes = {
  root: gridClasses.scrollbarFiller,
  header: gridClasses['scrollbarFiller--header'],
  borderBottom: gridClasses['scrollbarFiller--borderBottom'],
  pinnedRight: gridClasses['scrollbarFiller--pinnedRight'],
};

function GridScrollbarFillerCell({
  header,
  borderBottom = true,
  pinnedRight,
}: {
  header?: boolean;
  borderBottom?: boolean;
  pinnedRight?: boolean;
}) {
  return (
    <div
      role="presentation"
      className={clsx(
        classes.root,
        header && classes.header,
        borderBottom && classes.borderBottom,
        pinnedRight && classes.pinnedRight,
      )}
    />
  );
}

export { GridScrollbarFillerCell };
