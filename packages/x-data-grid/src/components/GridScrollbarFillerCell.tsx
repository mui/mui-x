import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass as getClassName } from '../constants';

const classes = {
  root: getClassName('scrollbarFiller'),
  header: getClassName('scrollbarFiller--header'),
  borderTop: getClassName('scrollbarFiller--borderTop'),
  pinnedRight: getClassName('scrollbarFiller--pinnedRight'),
};

const Style = styled('div')({
  minWidth: 'calc(var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
  alignSelf: 'stretch',
  [`&.${classes.borderTop}`]: {
    borderTop: '1px solid var(--DataGrid-rowBorderColor)',
  },
  [`&.${classes.pinnedRight}`]: {
    backgroundColor: 'var(--DataGrid-pinnedBackground)',
  },
  [`&.${classes.pinnedRight}:not(.${classes.header})`]: {
    position: 'sticky',
    right: 0,
  },
  [`&:not(.${classes.header}):not(.${classes.pinnedRight})`]: {
    transform: 'translate3d(var(--DataGrid-offsetLeft), 0, 0)',
  },
});

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
    <Style
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
