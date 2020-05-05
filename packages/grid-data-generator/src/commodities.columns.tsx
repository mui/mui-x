import './style/real-data-stories.css';
import { GeneratableColDef, random, randomArrayItem, randomInt, randomPrice, randomRate } from './services/';
import faker from 'faker';
import React from 'react';
import { Country, EmailRenderer, IncotermRenderer, IsDone, ProgressBar, StatusRenderer } from './renderer';
import {
  COMMODITY_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  COUNTRY_ISO_OPTIONS,
  CURRENCY_OPTIONS,
  INCOTERM_OPTIONS,
  RATE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  TAXCODE_OPTIONS,
} from './services/static-data';

export const commodityColumns: GeneratableColDef[] = [
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
    sortDirection: 'asc',
    sortIndex: 0,
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
    // eslint-disable-next-line react/display-name
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
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <ProgressBar value={Number(params.value)!} />,
    sortDirection: 'desc',
    sortIndex: 1,
    type: 'number',
    width: 120,
  },
  {
    field: 'isFilled',
    headerName: 'Is Filled',
    // eslint-disable-next-line react/display-name
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
    // eslint-disable-next-line react/display-name
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
    // eslint-disable-next-line react/display-name
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
    generateData: () => randomArrayItem(COUNTRY_ISO_OPTIONS),
    // eslint-disable-next-line react/display-name
    cellRenderer: params => <Country value={params.value! as any} />,
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
