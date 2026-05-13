import clsx from 'clsx';
import { gridClasses } from '../constants';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { usePinnedScrollOffset } from '../hooks/utils/usePinnedScrollOffset';
import { PinnedColumnPosition } from '../internals/constants';

const classes = {
  root: gridClasses.scrollbarFiller,
  pinnedRight: gridClasses['scrollbarFiller--pinnedRight'],
};

function GridScrollbarFillerCell({ pinnedRight }: { pinnedRight?: boolean }) {
  const apiRef = useGridPrivateApiContext();
  const pinnedScrollOffset = usePinnedScrollOffset(
    apiRef,
    pinnedRight ? PinnedColumnPosition.RIGHT : undefined,
  );

  return (
    <div
      role="presentation"
      className={clsx(classes.root, pinnedRight && classes.pinnedRight)}
      style={{ right: pinnedScrollOffset }}
    />
  );
}

export { GridScrollbarFillerCell };
