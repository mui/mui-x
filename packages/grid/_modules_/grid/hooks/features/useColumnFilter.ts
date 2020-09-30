import {ApiRef, ColDef, GridOptions, Rows} from "../../models";
import {useLogger} from "../utils";
import {useApiEventHandler} from "../root";
import {COLUMN_FILTER_CHANGED} from "../../constants";
import * as React from "react";

export const useColumnFilter = (
	apiRef: ApiRef,
	options: GridOptions,
	rows: Rows
): void => {
	const logger = useLogger('useColumnFilter');

	const onColumnFilterChanged = React.useCallback(({column, filterValues}: {column:ColDef, filterValues: string[]})=> {
		logger.info(`Filtering column ${column.field} with ${filterValues.join(', ')} `);
		const filterRegexes = filterValues.map(filterValue=> new RegExp(filterValue, 'ig'));

		let updates: any[] = [];
		rows.forEach(row=> {
			// const isShown = filterRegex.test(row.data[column.field]);
			const isShown = !filterRegexes.length || filterRegexes.some((regEx)=> regEx.test(row.data[column.field]));

			if(row.isHidden !== !isShown) {
				updates = [...updates, {id: row.id, isHidden: !isShown}];
			}
		});

		apiRef.current.updateRowModels(updates);
		apiRef.current.updateColumn(
			{...column, filterValue: filterValues }
		);

	}, [apiRef, logger, rows]);

	useApiEventHandler(apiRef, COLUMN_FILTER_CHANGED, onColumnFilterChanged);


};
