import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { isOverflown, classnames } from '../../utils/index';

const ColumnHeaderInnerTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ColumnHeaderInnerTitle(props, ref) {
  const { className, ...other } = props;

  return <div ref={ref} className={classnames('MuiDataGrid-colCellTitle', className)} {...other} />;
});

export interface ColumnHeaderTitleProps {
  label: string;
  columnWidth: number;
  description?: string;
}

// No React.memo here as if we display the sort icon, we need to recalculate the isOver
export function ColumnHeaderTitle(props: ColumnHeaderTitleProps) {
  const { label, description, columnWidth } = props;
  const titleRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState('');

  React.useEffect(() => {
    if (!description && titleRef && titleRef.current) {
      const isOver = isOverflown(titleRef.current);
      if (isOver) {
        setTooltip(label);
      } else {
        setTooltip('');
      }
    }
  }, [titleRef, columnWidth, description, label]);

  return (
    <Tooltip title={description || tooltip}>
      <ColumnHeaderInnerTitle ref={titleRef}>{label}</ColumnHeaderInnerTitle>
    </Tooltip>
  );
}
