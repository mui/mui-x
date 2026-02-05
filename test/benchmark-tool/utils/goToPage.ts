import path from 'path';
import { Page } from '@playwright/test';
import { CAPTURE_RENDER_FN, RenderEvent } from './Profiler';
import { generateReport, saveReport as saveReportToFs } from './reporter';

// Store mutable state per page so the callback can access updated values
interface PageState {
  renders: RenderEvent[];
  name: string;
}
const pageState = new WeakMap<Page, PageState>();

export function getRouteFromFilename(filename: string): string {
  return path.dirname(filename).split('/app').pop()!;
}

export async function goToPage(filename: string, page: Page, renders: RenderEvent[] = []) {
  const route = getRouteFromFilename(filename);

  // Initialize or update state for this page
  let state = pageState.get(page);
  if (!state) {
    state = { renders, name: 'initial' };
    pageState.set(page, state);

    // Expose function for Profiler to call (only register once per page)
    await page.exposeFunction(CAPTURE_RENDER_FN, (event: RenderEvent) => {
      const currentState = pageState.get(page)!;
      event.name = currentState.name;
      currentState.renders.push(event);
    });
  } else {
    // Update state for subsequent iterations
    state.renders = renders;
    state.name = 'initial';
  }

  await page.goto(route);

  const setName = (newName: string) => {
    const currentState = pageState.get(page);
    if (currentState) {
      currentState.name = newName;
    }
  };

  const saveReport = async () => {
    const report = generateReport(renders);
    await saveReportToFs(report, route);
  };

  return { renders, setName, saveReport };
}
