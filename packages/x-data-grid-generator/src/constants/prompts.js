"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPrompts = void 0;
exports.mockPrompts = new Map([
    [
        'sort by name',
        {
            conversationId: 'mock',
            select: -1,
            filters: [],
            aggregation: {},
            sorting: [
                {
                    column: 'name',
                    direction: 'asc',
                },
            ],
            grouping: [],
            pivoting: {},
            chart: null,
        },
    ],
    [
        'sort by company name and employee name',
        {
            conversationId: 'mock',
            select: -1,
            filters: [],
            aggregation: {},
            sorting: [
                {
                    column: 'company',
                    direction: 'asc',
                },
                {
                    column: 'name',
                    direction: 'asc',
                },
            ],
            grouping: [],
            pivoting: {},
            chart: null,
        },
    ],
    [
        'show people from the eu',
        {
            conversationId: 'mock',
            select: -1,
            filters: [
                {
                    column: 'country',
                    operator: 'isAnyOf',
                    value: [
                        'AT',
                        'BE',
                        'BG',
                        'CY',
                        'CZ',
                        'DE',
                        'DK',
                        'EE',
                        'ES',
                        'FI',
                        'FR',
                        'GR',
                        'HR',
                        'HU',
                        'IE',
                        'IT',
                        'LT',
                        'LU',
                        'LV',
                        'MT',
                        'NL',
                        'PL',
                        'PT',
                        'RO',
                        'SE',
                        'SI',
                        'SK',
                    ],
                },
            ],
            aggregation: {},
            sorting: [],
            grouping: [],
            pivoting: {},
            chart: null,
        },
    ],
    [
        'order companies by amount of people',
        {
            conversationId: 'mock',
            select: -1,
            filters: [],
            aggregation: {
                id: 'size',
            },
            sorting: [
                {
                    column: 'id',
                    direction: 'desc',
                },
            ],
            grouping: [
                {
                    column: 'company',
                },
            ],
            pivoting: {},
            chart: null,
        },
    ],
]);
