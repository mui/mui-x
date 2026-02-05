import path from 'path';
import { Page } from '@playwright/test';
import { CAPTURE_RENDER_FN, RenderEvent } from './Profiler';
import { generateReport, saveReport as saveReportToFs } from './reporter';

export async function goToPage(filename: string, page: Page) {
  const renders: RenderEvent[] = [];

  const route = path.dirname(filename).split('/app').pop()!;

  // Expose function for Profiler to call
  await page.exposeFunction(CAPTURE_RENDER_FN, (event: RenderEvent) => {
    renders.push(event);
  });

  await page.goto(route);

  const saveReport = async () => {
    const report = generateReport(renders);
    await saveReportToFs(report, route);
  };

  return { renders, saveReport };
}
