// Data in Data Grid row format (objects with named properties)
// Formulas reference cells using HyperFormula's A1 notation

export const rowData = [
  {
    id: 1,
    name: 'Greg Black',
    year_1: 4.66,
    year_2: '=B1*1.3',
    average: '=AVERAGE(B1:C1)',
    sum: '=SUM(B1:C1)',
  },
  {
    id: 2,
    name: 'Anne Carpenter',
    year_1: 5.25,
    year_2: '=$B$2*30%',
    average: '=AVERAGE(B2:C2)',
    sum: '=SUM(B2:C2)',
  },
  {
    id: 3,
    name: 'Natalie Dem',
    year_1: 3.59,
    year_2: '=B3*2.7+2+1',
    average: '=AVERAGE(B3:C3)',
    sum: '=SUM(B3:C3)',
  },
  {
    id: 4,
    name: 'John Sieg',
    year_1: 12.51,
    year_2: '=B4*(1.22+1)',
    average: '=AVERAGE(B4:C4)',
    sum: '=SUM(B4:C4)',
  },
  {
    id: 5,
    name: 'Chris Aklips',
    year_1: 7.63,
    year_2: '=B5*1.1*SUM(10,20)+1',
    average: '=AVERAGE(B5:C5)',
    sum: '=SUM(B5:C5)',
  },
  {
    id: 6,
    name: 'Total',
    year_1: '=SUM(B1:B5)',
    year_2: '=SUM(C1:C5)',
    average: '=IF(SUM(D1:D5)>100, "Greater than 100", "Less than 100")',
    sum: '=SUM(E1:E5)',
  },
];
