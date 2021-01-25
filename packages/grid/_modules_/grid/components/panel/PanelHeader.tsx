import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	root: {
		padding: 8,
	}
}), {name: 'MuiDataGridPanelHeader'});

export function PanelHeader(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	const classes = useStyles();
	const {children, className, ...otherProps} = props
	return <div className={`${classes.root} ${className}`} {...otherProps}>{children}</div>
}
