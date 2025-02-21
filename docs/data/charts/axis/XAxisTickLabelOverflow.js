import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

const defaultXAxis = {
  id: 'angle0',
  scaleType: 'band',
  dataKey: 'code',
  position: 'bottom',
  zoom: true,
  height: 80,
  valueFormatter: (value) =>
    usAirportPassengers.find((item) => item.code === value).fullName,
  label: '0deg Axis Title',
};

export default function XAxisTickLabelOverflow() {
  return (
    <BarChartPro
      xAxis={[
        {
          ...defaultXAxis,
          id: 'angle-90',
          label: '-90deg Axis Title',
          tickLabelStyle: {
            angle: -90,
            textAnchor: 'end',
            dominantBaseline: 'central',
          },
        },
        {
          ...defaultXAxis,
          id: 'angle-45',
          label: '-45deg Axis Title',
          tickLabelStyle: {
            angle: -45,
            textAnchor: 'end',
            dominantBaseline: 'central',
          },
        },
        defaultXAxis,
        {
          ...defaultXAxis,
          id: 'angle45',
          label: '45deg Axis Title',
          tickLabelStyle: {
            angle: 45,
            textAnchor: 'start',
          },
        },
        {
          ...defaultXAxis,
          id: 'angle90',
          label: '90deg Axis Title',
          tickLabelStyle: {
            angle: 90,
            textAnchor: 'start',
            dominantBaseline: 'central',
          },
        },
      ]}
      // Other props
      height={600}
      dataset={usAirportPassengers}
      series={[
        { dataKey: '2018', label: '2018' },
        { dataKey: '2019', label: '2019' },
        { dataKey: '2020', label: '2020' },
        { dataKey: '2021', label: '2021' },
        { dataKey: '2022', label: '2022' },
      ]}
      hideLegend
      yAxis={[
        {
          valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
          width: 40,
        },
      ]}
    />
  );
}

const usAirportPassengers = [
  {
    fullName: 'Hartsfield–Jackson Atlanta International Airport',
    code: 'ATL',
    2022: 45396001,
    2021: 36676010,
    2020: 20559866,
    2019: 53505795,
    2018: 51865797,
  },
  {
    fullName: 'Dallas/Fort Worth International Airport',
    code: 'DFW',
    2022: 35345138,
    2021: 30005266,
    2020: 18593421,
    2019: 35778573,
    2018: 32821799,
  },
  {
    fullName: 'Denver International Airport',
    code: 'DEN',
    2022: 33773832,
    2021: 28645527,
    2020: 16243216,
    2019: 33592945,
    2018: 31362941,
  },
  {
    fullName: "O'Hare International Airport",
    code: 'ORD',
    2022: 33120474,
    2021: 26350976,
    2020: 14606034,
    2019: 40871223,
    2018: 39873927,
  },
  {
    fullName: 'Los Angeles International Airport',
    code: 'LAX',
    2022: 32326616,
    2021: 23663410,
    2020: 14055777,
    2019: 42939104,
    2018: 42624050,
  },
  {
    fullName: 'John F. Kennedy International Airport',
    code: 'JFK',
    2022: 26919982,
    2021: 15273342,
    2020: 8269819,
    2019: 31036655,
    2018: 30620769,
  },
  {
    fullName: 'Harry Reid International Airport',
    code: 'LAS',
    2022: 25480500,
    2021: 19160342,
    2020: 10584059,
    2019: 24728361,
    2018: 23795012,
  },
  {
    fullName: 'Orlando International Airport',
    code: 'MCO',
    2022: 24469733,
    2021: 19618838,
    2020: 10467728,
    2019: 24562271,
    2018: 23202480,
  },
  {
    fullName: 'Miami International Airport',
    code: 'MIA',
    2022: 23949892,
    2021: 17500096,
    2020: 8786007,
    2019: 21421031,
    2018: 21021640,
  },
  {
    fullName: 'Charlotte Douglas International Airport',
    code: 'CLT',
    2022: 23100300,
    2021: 20900875,
    2020: 12952869,
    2019: 24199688,
    2018: 22281949,
  },
  {
    fullName: 'Seattle–Tacoma International Airport',
    code: 'SEA',
    2022: 22157862,
    2021: 17430195,
    2020: 9462411,
    2019: 25001762,
    2018: 24024908,
  },
  {
    fullName: 'Phoenix Sky Harbor International Airport',
    code: 'PHX',
    2022: 21852586,
    2021: 18940287,
    2020: 10531436,
    2019: 22433552,
    2018: 21622580,
  },
  {
    fullName: 'Newark Liberty International Airport',
    code: 'EWR',
    2022: 21572147,
    2021: 14514049,
    2020: 7985474,
    2019: 23160763,
    2018: 22797602,
  },
  {
    fullName: 'San Francisco International Airport',
    code: 'SFO',
    2022: 20411420,
    2021: 11725347,
    2020: 7745057,
    2019: 27779230,
    2018: 27790717,
  },
  {
    fullName: 'George Bush Intercontinental Airport',
    code: 'IAH',
    2022: 19814052,
    2021: 16242821,
    2020: 8682558,
    2019: 21905309,
    2018: 21157398,
  },
  {
    fullName: 'Logan International Airport',
    code: 'BOS',
    2022: 17443775,
    2021: 10909817,
    2020: 6035452,
    2019: 20699377,
    2018: 20006521,
  },
  {
    fullName: 'Fort Lauderdale–Hollywood International Airport',
    code: 'FLL',
    2022: 15370165,
    2021: 13598994,
    2020: 8015744,
    2019: 17950989,
    2018: 17612331,
  },
  {
    fullName: 'Minneapolis–Saint Paul International Airport',
    code: 'MSP',
    2022: 15242089,
    2021: 12211409,
    2020: 7069720,
    2019: 19192917,
    2018: 18361942,
  },
  {
    fullName: 'LaGuardia Airport',
    code: 'LGA',
    2022: 14367463,
    2021: 7827307,
    2020: 4147116,
    2019: 15393601,
    2018: 15058501,
  },
  {
    fullName: 'Detroit Metropolitan Airport',
    code: 'DTW',
    2022: 13751197,
    2021: 11517696,
    2020: 6822324,
    2019: 18143040,
    2018: 17436837,
  },
];
