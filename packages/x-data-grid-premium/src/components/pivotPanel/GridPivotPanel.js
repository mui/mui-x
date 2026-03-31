'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { GridPivotPanelHeader } from './GridPivotPanelHeader';
import { GridPivotPanelBody } from './GridPivotPanelBody';
function GridPivotPanel() {
    const [searchValue, setSearchValue] = React.useState('');
    return (_jsxs(React.Fragment, { children: [_jsx(GridPivotPanelHeader, { searchValue: searchValue, onSearchValueChange: setSearchValue }), _jsx(GridPivotPanelBody, { searchValue: searchValue })] }));
}
export { GridPivotPanel };
