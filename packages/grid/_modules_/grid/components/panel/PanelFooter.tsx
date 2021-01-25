import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	root: {
		padding: 4,
		display: 'flex',
		justifyContent: 'space-between',
	}
}), {name: 'MuiDataGridPanelFooter'})

export function PanelFooter(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	const classes = useStyles();
	const {children, className, ...otherProps} = props
	return <div className={`${classes.root} ${className}`} {...otherProps}>{children}</div>
}
