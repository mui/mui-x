import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../constants';

const classes = {
  root: gridClasses.scrollbarFiller,
};

function GridScrollbarFillerCell() {
  return <div role="presentation" className={clsx(classes.root)} />;
}

export { GridScrollbarFillerCell };
