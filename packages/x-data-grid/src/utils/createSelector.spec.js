"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSelector_1 = require("./createSelector");
(0, createSelector_1.createSelector)(
// @ts-expect-error The state must be typed with GridState
function (apiRef) { return apiRef.current.state.columns.orderedFields; }, function (fields) { return fields; });
(0, createSelector_1.createSelector)(function (apiRef) { return apiRef.current.state.columns.orderedFields; }, 
// @ts-expect-error Missing combiner function
function (apiRef) { return apiRef.current.state.columns.lookup; });
(0, createSelector_1.createSelector)(function (apiRef) { return apiRef.current.state.columns.orderedFields; }, function (fields) { return fields; })(null);
(0, createSelector_1.createSelector)(function (apiRef) { return apiRef.current.state.columns.orderedFields; }, function (fields) { return fields; })({});
(0, createSelector_1.createSelector)(
// @ts-expect-error Wrong state key
function (apiRef) { return apiRef.current.state.customKey; }, function (customKey) { return customKey.custmKeyBis; });
(0, createSelector_1.createSelector)(function (apiRef) { return apiRef.current.state.customKey; }, function (customKey) { return customKey.customKeyBis; });
