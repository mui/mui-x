import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { SidebarHeader } from '../../sidebar';
import { GridChartsPanelDataSearch } from './GridChartsPanelDataSearch';
function GridChartsPanelDataHeader(props) {
    const { searchValue, onSearchValueChange } = props;
    return (_jsx(SidebarHeader, { children: _jsx(GridChartsPanelDataSearch, { value: searchValue, onClear: () => onSearchValueChange(''), onChange: (event) => onSearchValueChange(event.target.value) }) }));
}
export { GridChartsPanelDataHeader };
