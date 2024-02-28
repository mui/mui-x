import * as React from 'react';
import clsx from 'clsx';
import { dataGridClasses } from '../constants';

const classes = {
  root: dataGridClasses.scrollbarFiller,
  header: dataGridClasses['scrollbarFiller--header'],
  borderTop: dataGridClasses['scrollbarFiller--borderTop'],
  pinnedRight: dataGridClasses['scrollbarFiller--pinnedRight'],
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
