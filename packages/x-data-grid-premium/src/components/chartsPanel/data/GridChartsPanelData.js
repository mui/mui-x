'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { GridChartsPanelDataBody } from './GridChartsPanelDataBody';
import { GridChartsPanelDataHeader } from './GridChartsPanelDataHeader';
function GridChartsPanelData() {
    const [searchValue, setSearchValue] = React.useState('');
    return (_jsxs(React.Fragment, { children: [_jsx(GridChartsPanelDataHeader, { searchValue: searchValue, onSearchValueChange: setSearchValue }), _jsx(GridChartsPanelDataBody, { searchValue: searchValue })] }));
}
export { GridChartsPanelData };
