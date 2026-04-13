import * as React from 'react';
import { TypesGauge } from './types.gauge';

export default function Page() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Gauge — new types pipeline POC</h1>
      <TypesGauge />
    </main>
  );
}
