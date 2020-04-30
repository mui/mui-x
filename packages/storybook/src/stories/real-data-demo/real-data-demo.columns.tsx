import { ColDef } from 'fin-ui-grid';
import {random, randomArrayItem, randomInt, randomPrice, randomRate} from '../../data/random-generator';
import faker from 'faker';
import React from 'react';
import {EmailRenderer} from "./renderer/email-renderer";
import {ProgressBar} from "./renderer/progress-bar";
import {IsDone} from "./renderer/done";
import {IncotermRenderer} from "./renderer/incoterm-renderer";
import {StatusRenderer} from "./renderer/status-renderer";
import {Country} from "./renderer/country";

export interface GeneratableColDef extends ColDef {
  generateData: (data: any) => any;
}
export const commodityGeneratableColumns: GeneratableColDef[] = [
  {
    field: 'id',
    generateData: () => faker.random.uuid(),
    hide: true,
  },
  {
    field: 'desk',
    headerName: 'Desk',
    generateData: () => 'D-' + faker.random.number(),
  },
  {
    field: 'commodity',
    headerName: 'Commodity',
    generateData: () => randomArrayItem(COMMODITY_OPTIONS),
    width: 120,
  },
  {
    field: 'traderId',
    headerName: 'Trader Id',
    generateData: () => faker.random.number(),
  },
  {
    field: 'traderName',
    headerName: 'Trader Name',
    generateData: () => faker.name.findName(),
    cellRenderer: params => <EmailRenderer email={params.data['traderEmail']} label={params.value!.toString()} />,
    disableClickEventBubbling: true,
    width: 150,
  },
  {
    field: 'traderEmail',
    headerName: 'Trader Email',
    generateData: () => faker.internet.email(),
    width: 200,
    hide: true,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    generateData: () => randomPrice(1, 100),
    // valueFormatter: params=> `${Number(params.value).toLocaleString()} ${params.data['unitPriceCurrency']}`,
    type: 'number',
    width: 100,
  },
  {
    field: 'unitPriceCurrency',
    headerName: 'Unit Price Currency',
    generateData: () => randomArrayItem(CURRENCY_OPTIONS),
    width: 70,
    // hide: true
  },
  {
    field: 'quantity',
    type: 'number',
    generateData: () => randomInt(1000, 100000),
  },
  {
    field: 'filledQuantity',
    headerName: 'Filled Quantity',
    generateData: data => Number((data.quantity * randomRate()).toFixed()) / data.quantity,
    cellRenderer: params => <ProgressBar value={Number(params.value)!} />,
    type: 'number',
    width: 120,
  },
  {
    field: 'isFilled',
    headerName: 'Is Filled',
    cellRenderer: params => <IsDone value={!!params.value} />,
    align: 'center',
    generateData: data => data.quantity === data.filledQuantity,
    width: 50,
  },
  {
    field: 'subTotal',
    headerName: 'Sub Total',
    generateData: data => data.unitPrice * data.quantity,
    type: 'number',
    width: 120,
  },
  {
    field: 'feeRate',
    headerName: 'Fee Rate',
    generateData: () => random(0.1, 0.4),
    type: 'number',
    width: 80,
  },
  {
    field: 'feeAmount',
    headerName: 'Fee Amount',
    generateData: data => Number(data.feeRate) * data.subTotal,
    type: 'number',
    width: 120,
  },
  {
    field: 'incoTerm',
    generateData: () => randomArrayItem(INCOTERM_OPTIONS),
    cellRenderer: params => <IncotermRenderer value={params.value!} />,
    width: 100,
  },
  {
    field: 'totalPrice',
    headerName: 'Total in USD',
    generateData: data => data.feeRate + data.subTotal,
    valueFormatter: ({ value }) => `$ ${Number(value).toLocaleString()}`,
    cellClassRules: {
      good: ({ value }) => Number(value) > 1000000,
      bad: ({ value }) => Number(value) < 1000000,
    },
    type: 'number',
    width: 120,
  },
  {
    field: 'status',
    generateData: data => randomArrayItem(STATUS_OPTIONS),
    cellRenderer: params => <StatusRenderer status={params.value!.toString()} />,
    width: 150,
  },
  {
    field: 'pnl',
    headerName: 'PnL',
    generateData: () => random(-100000000, 100000000),
    valueFormatter: params =>
      Number(params.value!) < 0
        ? `(${Math.abs(Number(params.value!)).toLocaleString()})`
        : Number(params.value).toLocaleString(),
    cellClassRules: {
      positive: ({ value }) => Number(value) > 0,
      negative: ({ value }) => Number(value) < 0,
    },
    type: 'number',
    width: 120,
  },
  {
    field: 'maturityDate',
    headerName: 'Maturity Date',
    generateData: () => faker.date.future(),
    type: 'date',
  },
  {
    field: 'tradeDate',
    headerName: 'Trade Date',
    generateData: () => faker.date.recent(),
    type: 'date',
  },
  {
    field: 'brokerId',
    headerName: 'Broker Id',
    generateData: () => faker.random.uuid(),
    hide: true,
  },
  {
    field: 'brokerName',
    headerName: 'Broker Name',
    generateData: () => faker.company.companyName(),
    width: 140,
  },
  {
    field: 'counterPartyName',
    headerName: 'Counterparty',
    generateData: () => faker.company.companyName(),
    width: 180,
  },
  {
    field: 'counterPartyCountry',
    headerName: 'Counterparty Country',
    generateData: () => randomArrayItem(COUNTRY_OPTIONS),
    cellRenderer: params => <Country value={params.value!.toString()} />,
    width: 120,
  },
  {
    field: 'counterPartyCurrency',
    headerName: 'Counterparty Currency',
    generateData: () => randomArrayItem(CURRENCY_OPTIONS),
  },
  {
    field: 'counterPartyAddress',
    headerName: 'Counterparty Address',
    generateData: () => faker.address.streetAddress(),
    width: 200,
  },
  {
    field: 'counterPartyCity',
    headerName: 'Counterparty City',
    generateData: () => faker.address.city(),
    width: 120,
  },
  {
    field: 'taxCode',
    headerName: 'Tax Code',
    generateData: () => randomArrayItem(TAXCODE_OPTIONS),
  },
  {
    field: 'contractType',
    headerName: 'Contract Type',
    generateData: () => randomArrayItem(CONTRACT_TYPE_OPTIONS),
  },
  {
    field: 'rateType',
    headerName: 'Rate Type',
    generateData: () => randomArrayItem(RATE_TYPE_OPTIONS),
  },
  {
    field: 'lastUpdated',
    headerName: 'Updated on',
    generateData: () => faker.date.recent(),
    type: 'dateTime',
    width: 180,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    generateData: () => faker.date.past(),
    type: 'date',
    width: 150,
  },
];

const STATUS_OPTIONS = ['Open', 'PartiallyFilled', 'Filled', 'Rejected'];
const TAXCODE_OPTIONS = ['BR', '1250L', '20G', 'BC45', 'IGN179'];
const RATE_TYPE_OPTIONS = ['Fixed', 'Floating'];
const CONTRACT_TYPE_OPTIONS = ['FP', 'TM', 'CR'];
const INCOTERM_OPTIONS = [
  'EXW (Ex Works)',
  'FAS (Free Alongside Ship)',
  'FCA (Free Carrier)',
  'CPT (Carriage Paid To)',
  'DAP (Delivered at Place)',
  'DPU (Delivered at Place Unloaded)',
  'DDP (Delivered Duty Paid)',
];
const COMMODITY_OPTIONS = [
  'Corn',
  'Oats',
  'Rough Rice',
  'Soybeans',
  'Rapeseed',
  'Soybeans',
  'Soybean Meal',
  'Soybean Oil',
  'Wheat',
  'Milk',
  'Cocoa',
  'Coffee C',
  'Cotton No.2',
  'Sugar No.11',
  'Sugar No.14',
  'Frozen Concentrated Orange Juice',
  'Adzuki bean',
  'Robusta coffee',
];

const CURRENCY_OPTIONS = [
  'USD',
  'GBP',
  'JPY',
  'EUR',
  'BRZ',
  'MXN',
  'AUD',
  'CAD',
  'NZD',
  'ARS',
  'CHF',
  'THB',
  'HKD',
  'TRY',
];
const COUNTRY_OPTIONS = [
  'United States',
  'United Kingdom',
  'Japan',
  'France',
  'Brazil',
  'Mexico',
  'Australia',
  'Canada',
  'New Zealand',
  'Argentina',
  'Switzerland',
  'Thailand',
  'Hong Kong',
  'Turkey',
];
