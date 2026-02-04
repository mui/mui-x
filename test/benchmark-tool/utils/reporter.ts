import * as path from 'node:path';
import * as fs from 'node:fs';
import type { TraceEvent } from './reporter-types';
import type { RenderEvent } from './Profiler';

const benchmarksDir = path.resolve(__dirname, '../benchmarks');

export function saveReport(report: Report, route: string) {
  // Ensure benchmarks directory exists
  if (!fs.existsSync(benchmarksDir)) {
    fs.mkdirSync(benchmarksDir, { recursive: true });
  }

  // Save report as JSON file based on route name
  const fileName = route.replace(/\//g, '-').replace(/^-/, '') || 'index';
  const filePath = path.join(benchmarksDir, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

  // eslint-disable-next-line no-console
  console.log(`Report saved to: ${filePath}`);
}

interface Report {
  traceEvents: TraceEvent[];
}

export function generateReport(events: RenderEvent[]): Report {
  return {
    traceEvents: events.map(mapRenderEventToTraceEvent),
  };
}

function mapRenderEventToTraceEvent(event: RenderEvent): TraceEvent {
  return {
    name: 'React Render',
    cat: 'react',
    ph: 'X',
    ts: 0, // Placeholder, should be replaced with actual timestamp
    dur: event.actualDuration * 1000, // Convert ms to µs
    pid: 0,
    tid: 0,
    args: {
      id: event.id,
      phase: event.phase,
    },
  };
}
