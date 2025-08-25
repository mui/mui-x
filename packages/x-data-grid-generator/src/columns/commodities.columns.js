"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommodityColumns = void 0;
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var services_1 = require("../services");
var renderer_1 = require("../renderer");
var static_data_1 = require("../services/static-data");
var getCommodityColumns = function (editable) {
    if (editable === void 0) { editable = false; }
    return [
        {
            field: 'id',
            generateData: services_1.randomId,
            hide: true,
        },
        {
            field: 'desk',
            headerName: 'Desk',
            generateData: services_1.randomDesk,
            width: 110,
        },
        {
            field: 'commodity',
            headerName: 'Commodity',
            generateData: services_1.randomCommodity,
            width: 180,
            editable: editable,
        },
        {
            field: 'traderName',
            headerName: 'Trader Name',
            generateData: services_1.randomTraderName,
            width: 120,
            editable: editable,
        },
        {
            field: 'traderEmail',
            headerName: 'Trader Email',
            generateData: services_1.randomEmail,
            renderCell: renderer_1.renderEmail,
            width: 150,
            editable: editable,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            width: 140,
            generateData: services_1.randomQuantity,
            editable: editable,
            valueParser: function (value) { return Number(value); },
        },
        {
            field: 'filledQuantity',
            headerName: 'Filled Quantity',
            generateData: services_1.generateFilledQuantity,
            renderCell: renderer_1.renderProgress,
            renderEditCell: renderer_1.renderEditProgress,
            availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
            type: 'number',
            width: 120,
            editable: editable,
        },
        {
            field: 'isFilled',
            headerName: 'Is Filled',
            align: 'center',
            generateData: services_1.generateIsFilled,
            type: 'boolean',
            width: 80,
            editable: editable,
        },
        {
            field: 'status',
            headerName: 'Status',
            generateData: services_1.randomStatusOptions,
            renderCell: renderer_1.renderStatus,
            renderEditCell: renderer_1.renderEditStatus,
            type: 'singleSelect',
            valueOptions: static_data_1.STATUS_OPTIONS,
            width: 150,
            editable: editable,
        },
        {
            field: 'unitPrice',
            headerName: 'Unit Price',
            generateData: services_1.randomUnitPrice,
            type: 'number',
            editable: editable,
            valueParser: function (value) { return Number(value); },
        },
        {
            field: 'unitPriceCurrency',
            headerName: 'Unit Price Currency',
            generateData: services_1.randomUnitPriceCurrency,
            renderEditCell: renderer_1.renderEditCurrency,
            type: 'singleSelect',
            valueOptions: static_data_1.CURRENCY_OPTIONS,
            width: 120,
            editable: editable,
        },
        {
            field: 'subTotal',
            headerName: 'Sub Total',
            valueGetter: function (value, row) {
                return row.quantity == null || row.unitPrice == null ? null : row.quantity * row.unitPrice;
            },
            type: 'number',
            width: 120,
        },
        {
            field: 'feeRate',
            headerName: 'Fee Rate',
            generateData: services_1.randomFeeRate,
            type: 'number',
            width: 80,
            editable: editable,
            valueParser: function (value) { return Number(value); },
        },
        {
            field: 'feeAmount',
            headerName: 'Fee Amount',
            valueGetter: function (value, row) {
                return row.feeRate == null || row.quantity == null || row.unitPrice == null
                    ? null
                    : row.feeRate * row.quantity * row.unitPrice;
            },
            type: 'number',
            width: 120,
        },
        {
            field: 'incoTerm',
            headerName: 'Incoterm',
            generateData: services_1.randomIncoterm,
            renderCell: renderer_1.renderIncoterm,
            renderEditCell: renderer_1.renderEditIncoterm,
            type: 'singleSelect',
            valueOptions: static_data_1.INCOTERM_OPTIONS,
            editable: editable,
        },
        {
            field: 'totalPrice',
            headerName: 'Total in USD',
            valueGetter: function (value, row) {
                return row.feeRate == null || row.quantity == null || row.unitPrice == null
                    ? null
                    : row.feeRate + row.quantity * row.unitPrice;
            },
            renderCell: renderer_1.renderTotalPrice,
            type: 'number',
            width: 160,
        },
        {
            field: 'pnl',
            headerName: 'PnL',
            generateData: services_1.randomPnL,
            renderCell: renderer_1.renderPnl,
            type: 'number',
            width: 140,
        },
        {
            field: 'maturityDate',
            headerName: 'Maturity Date',
            generateData: services_1.randomMaturityDate,
            type: 'date',
            editable: editable,
        },
        {
            field: 'tradeDate',
            headerName: 'Trade Date',
            generateData: services_1.randomTradeDate,
            type: 'date',
            editable: editable,
        },
        {
            field: 'brokerId',
            headerName: 'Broker Id',
            generateData: services_1.randomBrokerId,
            hide: true,
            editable: editable,
        },
        {
            field: 'brokerName',
            headerName: 'Broker Name',
            generateData: services_1.randomCompanyName,
            width: 140,
            editable: editable,
        },
        {
            field: 'counterPartyName',
            headerName: 'Counterparty',
            generateData: services_1.randomCompanyName,
            width: 180,
            editable: editable,
        },
        {
            field: 'counterPartyCountry',
            headerName: 'Counterparty Country',
            type: 'singleSelect',
            generateData: services_1.randomCountry,
            renderCell: renderer_1.renderCountry,
            valueOptions: static_data_1.COUNTRY_ISO_OPTIONS_SORTED,
            valueParser: function (value) {
                if (typeof value === 'string') {
                    return static_data_1.COUNTRY_ISO_OPTIONS_SORTED.find(function (country) { return country.value === value; });
                }
                return value;
            },
            valueFormatter: function (value) { return value === null || value === void 0 ? void 0 : value.label; },
            groupingValueGetter: function (value) { return value === null || value === void 0 ? void 0 : value.label; },
            sortComparator: function (v1, v2, param1, param2) {
                return (0, x_data_grid_premium_1.gridStringOrNumberComparator)(v1.label, v2.label, param1, param2);
            },
            getOptionLabel: function (value) { return value === null || value === void 0 ? void 0 : value.label; },
            editable: editable,
            width: 120,
        },
        {
            field: 'counterPartyCurrency',
            headerName: 'Counterparty Currency',
            generateData: services_1.randomCurrency,
            renderEditCell: renderer_1.renderEditCurrency,
            type: 'singleSelect',
            valueOptions: static_data_1.CURRENCY_OPTIONS,
            editable: editable,
        },
        {
            field: 'counterPartyAddress',
            headerName: 'Counterparty Address',
            generateData: services_1.randomAddress,
            width: 200,
            editable: editable,
        },
        {
            field: 'counterPartyCity',
            headerName: 'Counterparty City',
            generateData: services_1.randomCity,
            width: 120,
            editable: editable,
        },
        {
            field: 'taxCode',
            headerName: 'Tax Code',
            generateData: services_1.randomTaxCode,
            type: 'singleSelect',
            valueOptions: static_data_1.TAXCODE_OPTIONS,
            editable: editable,
        },
        {
            field: 'contractType',
            headerName: 'Contract Type',
            generateData: services_1.randomContractType,
            type: 'singleSelect',
            valueOptions: static_data_1.CONTRACT_TYPE_OPTIONS,
            editable: editable,
        },
        {
            field: 'rateType',
            headerName: 'Rate Type',
            generateData: services_1.randomRateType,
            type: 'singleSelect',
            valueOptions: static_data_1.RATE_TYPE_OPTIONS,
            editable: editable,
        },
        {
            field: 'lastUpdated',
            headerName: 'Updated on',
            generateData: services_1.randomUpdatedDate,
            type: 'dateTime',
            width: 180,
            editable: editable,
        },
        {
            field: 'dateCreated',
            headerName: 'Created on',
            generateData: services_1.randomCreatedDate,
            type: 'date',
            width: 150,
            editable: editable,
        },
    ];
};
exports.getCommodityColumns = getCommodityColumns;
