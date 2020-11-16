import * as React from 'react';
import { TextField } from '@material-ui/core';
import { FilterItem } from '../../hooks/features/filter/visibleRowsState';
import { LoadIcon } from '../icons/index';

const SUBMIT_FILTER_STROKE_TIME = 500;

export interface FilterInputValueProps {
	item: FilterItem;
	applyValue: (value: FilterItem)=> void;
}

export const StringFilterInputValue: React.FC<FilterInputValueProps> = ({item, applyValue})=> {
	const filterTimeout = React.useRef<any>();
	const [filterValueState, setFilterValueState] = React.useState(item.value || '');
	const [applying, setIsApplying] = React.useState(false);

	const onFilterChange = React.useCallback(
		(event) => {
			clearTimeout(filterTimeout.current);
			const value = event.target.value;
			setFilterValueState(value);
			setIsApplying( true);
			filterTimeout.current = setTimeout(() => {
				applyValue({ ...item, value });
				setIsApplying(false);
			}, SUBMIT_FILTER_STROKE_TIME);
		},
		[applyValue, item],
	);

	React.useEffect(() => {
		return () => {
			clearTimeout(filterTimeout.current);
		};
	}, []);

	return (
		<TextField
			label={'Value'}
			placeholder={'Filter value'}
			value={filterValueState}
			onChange={onFilterChange}
			InputProps={{
				endAdornment: applying && <LoadIcon />,
			}}
		/>
	);
};
