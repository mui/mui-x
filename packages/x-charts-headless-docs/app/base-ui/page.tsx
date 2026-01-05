'use client';
import { Chart } from './Chart';
import './page.css';

export default function BaseUIIntegration() {
  return (
    <div className="page-container">
      <header className="header">
        <h1>Base UI Integration</h1>
        <p className="subtitle">
          Headless Charts with{' '}
          <a
            href="https://base-ui.com/react/overview/quick-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            Base UI
          </a>{' '}
          components
        </p>
      </header>

      <section className="section">
        <h2>Interactive Pie Chart</h2>
        <p>
          Hover over the chart segments to see the tooltip powered by Base UI&apos;s Popover
          component.
        </p>

        <div className="chart-container">
          <Chart />
        </div>
      </section>
    </div>
  );
}
