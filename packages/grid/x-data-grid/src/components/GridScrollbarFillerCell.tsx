import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../constants';

const className = getDataGridUtilityClass('scrollbarFiller');

const Style = styled('div')({
  minWidth: 'calc(var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
  alignSelf: 'stretch',
  '&.borderTop': {
    borderTop: '1px solid var(--DataGrid-rowBorderColor)',
  },
  '&.pinnedRight': {
    backgroundColor: 'var(--DataGrid-pinnedBackground)',
  },
  '&.pinnedRight:not(.header)': {
    position: 'sticky',
    right: 0,
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
        className,
        header && 'header',
        borderTop && 'borderTop',
        pinnedRight && 'pinnedRight',
      )}
    />
  );
}

export { GridScrollbarFillerCell };
