"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var DatePicker_1 = require("@mui/x-date-pickers/DatePicker");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
// prettier-ignore
var DateRangePicker_1 = require("@mui/x-date-pickers-pro/DateRangePicker");
var TextField_1 = require("@mui/material/TextField");
var className = DateCalendar_1.dayCalendarClasses.root;
<div>
  <DateRangePicker_1.DateRangePicker slotProps={{
        layout: {
            sx: {
                width: 50,
            },
        },
    }} slots={{
        layout: test,
    }}/>
  <DatePicker_1.DatePicker slots={{
        layout: CustomLayout,
    }}/>
  <TextField_1.default components={{
        Input: CustomInput,
    }}/>
</div>;
