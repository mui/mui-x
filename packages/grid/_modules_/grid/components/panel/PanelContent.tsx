import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { classnames } from '../../utils/classnames';

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      flex: '1 1',
      maxHeight: 400,
    },
  }),
  { name: 'MuiDataGridPanelContent' },
);

export function PanelContent(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const classes = useStyles();
  const { children, className, ...otherProps } = props;
  return (
    <div className={classnames(classes.root, className)} {...otherProps}>
      {children}
    </div>
  );
}
