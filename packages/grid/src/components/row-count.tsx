import React from 'react';

export const RowCount: React.FC<{ rowCount: number }> = ({ rowCount }) => {
  return <div className={'row-count'}>Total Rows: {rowCount.toLocaleString()}</div>;
};
