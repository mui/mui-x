"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPivotPanel = GridPivotPanel;
var React = require("react");
var GridPivotPanelHeader_1 = require("./GridPivotPanelHeader");
var GridPivotPanelBody_1 = require("./GridPivotPanelBody");
function GridPivotPanel() {
    var _a = React.useState(''), searchValue = _a[0], setSearchValue = _a[1];
    return (<React.Fragment>
      <GridPivotPanelHeader_1.GridPivotPanelHeader searchValue={searchValue} onSearchValueChange={setSearchValue}/>
      <GridPivotPanelBody_1.GridPivotPanelBody searchValue={searchValue}/>
    </React.Fragment>);
}
