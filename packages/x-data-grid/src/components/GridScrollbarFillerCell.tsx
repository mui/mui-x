import clsx from 'clsx';
import { gridClasses } from '../constants';

const classes = {
  root: gridClasses.scrollbarFiller,
  pinnedRight: gridClasses['scrollbarFiller--pinnedRight'],
};

function GridScrollbarFillerCell({ pinnedRight }: { pinnedRight?: boolean }) {
  return (
    <div role="presentation" className={clsx(classes.root, pinnedRight && classes.pinnedRight)} />
  );
}

export { GridScrollbarFillerCell };
