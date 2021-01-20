import * as React from 'react';
import { visibleColumnsLengthSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { classnames } from '../../utils';
import { getCurryTotalHeight } from '../../utils/getTotalHeight';
import { ApiContext } from '../api-context';
import { useStyles } from './GridRootStyles';

export interface GridRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size: { width: number; height: number };
  header: React.RefObject<HTMLDivElement>;
  footer: React.RefObject<HTMLDivElement>;
}

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const { className, style, ...other } = props;
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const visibleColumnsLength = useGridSelector(apiRef, visibleColumnsLengthSelector);
  const [gridState] = useGridState(apiRef!);

  const getTotalHeight = React.useCallback(
    (size) =>
      getCurryTotalHeight(
        gridState.options,
        gridState.containerSizes,
        props.header,
        props.footer,
      )(size),
    [gridState.options, gridState.containerSizes, props.header, props.footer],
  );

  return (
    <div
      ref={ref}
      className={classnames(classes.root, className)}
      role="grid"
      aria-colcount={visibleColumnsLength}
      aria-rowcount={gridState.rows.totalRowCount}
      tabIndex={0}
      aria-label={apiRef!.current.getLocaleText('rootGridLabel')}
      aria-multiselectable={!gridState.options.disableMultipleSelection}
      style={{ width: props.size.width, height: getTotalHeight(props.size), ...style }}
      {...other}
    />
  );
});
