import * as React from 'react';
import { TypesDataGrid } from './types.data-grid';

export default function Page() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>DataGrid — new types pipeline POC (diagnostic)</h1>
      <TypesDataGrid />
    </main>
  );
}
