import * as React from "react";
import { COLUMN_FILTER_CHANGED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { ColDef } from '../../../models/colDef/colDef';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { FilterState } from './filterState';

export const useFilter = (
	apiRef: ApiRef
): void => {
	const logger = useLogger('useFilter');
	const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

	const rows = useGridSelector(apiRef, sortedRowsSelector);

	const onColumnFilterChanged = React.useCallback(({column, filterValues}: {column:ColDef, filterValues: string[]})=> {
		logger.info(`Filtering column ${column.field} with ${filterValues.join(', ')} `);
		const filterRegexes = filterValues.map(filterValue => new RegExp(filterValue, 'ig'));

		setGridState(state => {
			const newFilterState: FilterState = {...state.filter, hiddenRows: []};
			rows.forEach(row => {
				// const isShown = filterRegex.test(row.data[column.field]);
				const isShown = !filterRegexes.length || filterRegexes.some((regEx) => regEx.test(row.data[column.field]));

				if (!isShown) {
					newFilterState.hiddenRows.push(row.id);
				}
			});
			return {...state, filter: newFilterState};
		});

		apiRef.current.updateColumn(
			{...column, filterValue: filterValues}
		);
		forceUpdate();

	}, [apiRef, forceUpdate, logger, rows, setGridState]);

	useApiEventHandler(apiRef, COLUMN_FILTER_CHANGED, onColumnFilterChanged);


};
