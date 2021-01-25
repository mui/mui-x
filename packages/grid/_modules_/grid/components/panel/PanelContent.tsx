import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
		flex: '1 1',
	}
}), {name: 'MuiDataGridPanelContent'})

export function PanelContent(props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	const classes = useStyles();
	const {children, className, ...otherProps} = props
	return <div className={`${classes.root} ${className}`} {...otherProps}>{children}</div>
}
