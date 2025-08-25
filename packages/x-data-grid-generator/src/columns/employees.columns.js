"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeColumns = void 0;
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var services_1 = require("../services");
var renderer_1 = require("../renderer");
var static_data_1 = require("../services/static-data");
var getEmployeeColumns = function () { return [
    {
        field: 'id',
        generateData: services_1.randomId,
        hide: true,
    },
    {
        field: 'avatar',
        headerName: 'Avatar',
        generateData: services_1.randomColor,
        display: 'flex',
        renderCell: renderer_1.renderAvatar,
        valueGetter: function (value, row) {
            return row.name == null || row.avatar == null ? null : { name: row.name, color: row.avatar };
        },
        sortable: false,
        filterable: false,
        groupable: false,
        aggregable: false,
        disableExport: true,
    },
    {
        field: 'name',
        headerName: 'Name',
        generateData: services_1.randomName,
        dataGeneratorUniquenessEnabled: true,
        width: 120,
        editable: true,
        groupable: false,
        aggregable: false,
    },
    {
        field: 'website',
        headerName: 'Website',
        generateData: services_1.randomUrl,
        renderCell: renderer_1.renderLink,
        width: 160,
        editable: true,
        groupable: false,
        aggregable: false,
    },
    {
        field: 'rating',
        headerName: 'Rating',
        generateData: services_1.randomRating,
        display: 'flex',
        renderCell: renderer_1.renderRating,
        renderEditCell: renderer_1.renderEditRating,
        width: 180,
        type: 'number',
        editable: true,
        availableAggregationFunctions: ['avg', 'min', 'max', 'size'],
    },
    {
        field: 'email',
        headerName: 'Email',
        generateData: services_1.randomEmail,
        renderCell: renderer_1.renderEmail,
        width: 150,
        editable: true,
    },
    {
        field: 'phone',
        headerName: 'Phone',
        generateData: services_1.randomPhoneNumber,
        width: 150,
        editable: true,
    },
    {
        field: 'username',
        headerName: 'Username',
        generateData: services_1.randomUserName,
        width: 150,
        editable: true,
    },
    {
        field: 'city',
        headerName: 'City',
        generateData: services_1.randomCity,
        editable: true,
    },
    {
        field: 'country',
        headerName: 'Country',
        type: 'singleSelect',
        valueOptions: static_data_1.COUNTRY_ISO_OPTIONS_SORTED,
        valueFormatter: function (value) { return value === null || value === void 0 ? void 0 : value.label; },
        generateData: services_1.randomCountry,
        renderCell: renderer_1.renderCountry,
        renderEditCell: renderer_1.renderEditCountry,
        groupingValueGetter: function (value) { return value === null || value === void 0 ? void 0 : value.label; },
        sortComparator: function (v1, v2, param1, param2) {
            return (0, x_data_grid_premium_1.gridStringOrNumberComparator)(v1.label, v2.label, param1, param2);
        },
        width: 150,
        editable: true,
    },
    {
        field: 'company',
        headerName: 'Company',
        generateData: services_1.randomCompanyName,
        width: 180,
        editable: true,
    },
    {
        field: 'position',
        description: 'Job title',
        headerName: 'Position',
        generateData: services_1.randomJobTitle,
        width: 180,
        editable: true,
    },
    {
        field: 'lastUpdated',
        headerName: 'Updated on',
        generateData: services_1.randomUpdatedDate,
        type: 'dateTime',
        width: 180,
        editable: true,
    },
    {
        field: 'dateCreated',
        headerName: 'Created on',
        generateData: services_1.randomCreatedDate,
        type: 'date',
        width: 120,
        editable: true,
    },
    {
        field: 'isAdmin',
        headerName: 'Is admin?',
        generateData: services_1.randomBoolean,
        type: 'boolean',
        width: 150,
        editable: true,
    },
    {
        field: 'salary',
        headerName: 'Salary',
        generateData: function () { return (0, services_1.randomInt)(30000, 80000); },
        type: 'number',
        valueFormatter: function (value) {
            if (!value || typeof value !== 'number') {
                return value;
            }
            return "$".concat(value.toLocaleString());
        },
    },
]; };
exports.getEmployeeColumns = getEmployeeColumns;
