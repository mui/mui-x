import { afterEach, bench, describe } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

describe('fibo', () => {
  afterEach(() => {
    cleanup();
  });

  bench('fibo 10', async () => {
    const { findByText } = render(<div>Anthony Fu</div>);

    await findByText('Anthony Fu');
  });
});
