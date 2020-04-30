import React from "react";
import {CellValue} from "fin-ui-grid";
import {Tooltip} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

export const IncotermRenderer: React.FC<{ value: CellValue }> = React.memo(({ value }) => {
	if (!value) {
		return null;
	}
	const valueStr = value.toString();
	const tooltip = valueStr.slice(valueStr.indexOf('('), valueStr.indexOf(')'));
	const code = valueStr.slice(0, valueStr.indexOf('(')).trim();
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<span>{code}</span>
			<Tooltip title={tooltip}>
				<InfoIcon className={'info-icon'} />
			</Tooltip>
		</div>
	);
});