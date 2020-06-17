import React from 'react';

export const SelectedRowCount: React.FC<{ selectedRowCount: number }> = ({ selectedRowCount }) => {
  return (
    <div className={'row-count'}>
      {' '}
      {selectedRowCount > 0 ? `${selectedRowCount} ${selectedRowCount > 1 ? 'rows' : 'row'} selected` : ''}
    </div>
  );
};
