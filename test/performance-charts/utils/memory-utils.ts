import { cdp } from '@vitest/browser/context';

const memoryUsageData = new Map<string, number[]>();

export async function getMemoryUsage() {
  return (await cdp().send('Runtime.getHeapUsage')).usedSize;
}

export function addMemoryUsageEntry(name: string, usage: number) {
  const usages = memoryUsageData.get(name) ?? [];

  usages.push(usage);

  memoryUsageData.set(name, usages);
}

export function reportMemoryUsage() {
  const report = [];

  for (const [name, usages] of memoryUsageData.entries()) {
    const min = Math.min(...usages);
    const max = Math.max(...usages);
    const avg = usages.reduce((sum, value) => sum + value, 0) / usages.length;

    report.push({ name, min: formatAsMb(min), max: formatAsMb(max), avg: formatAsMb(avg) });
  }

  console.log('Memory Usage Report:', report);
}

function formatAsMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
