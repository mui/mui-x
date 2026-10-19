import { posix } from 'node:path';
import { test, expect, type Page } from '@playwright/test';

const FILE_PREFIX = 'project[files][';
const SOURCE_EXTENSIONS = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];

type ExportFiles = Record<string, string>;
type ExportWindow = Window & { exportedFiles?: ExportFiles };

async function exportDemo(page: Page, route: string, name: string) {
  // Capture the real sandbox payload without sending it to StackBlitz.
  await page.addInitScript(() => {
    HTMLFormElement.prototype.submit = function captureExport() {
      (window as ExportWindow).exportedFiles = Object.fromEntries(
        Array.from(new FormData(this).entries(), ([key, value]) => [key, String(value)]),
      );
    };
  });
  await page.goto(`${route}#${name}.tsx`);
  const demo = page.locator(`#${name}`).locator('..');
  await expect(async () => {
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.getByRole('toolbar', { name: 'demo source' })).not.toHaveAttribute(
      'aria-busy',
      'true',
    );
  }).toPass({ timeout: 15_000 });
  await demo.getByRole('button', { name: 'Show TypeScript source' }).click();
  await demo.getByRole('button', { name: 'Edit in StackBlitz' }).click();
  await expect.poll(() => page.evaluate(() => (window as ExportWindow).exportedFiles)).toBeTruthy();

  const fields = await page.evaluate(() => (window as ExportWindow).exportedFiles!);
  return Object.fromEntries(
    Object.entries(fields)
      .filter(([key]) => key.startsWith(FILE_PREFIX))
      .map(([key, value]) => [key.slice(FILE_PREFIX.length, -1), value]),
  );
}

function dependencies(files: ExportFiles): Record<string, string> {
  return JSON.parse(files['package.json']).dependencies;
}

test.describe('Docs demo exports', () => {
  test.skip(!process.env.PLAYWRIGHT_TEST_BASE_URL, 'Set the migrated docs build URL explicitly.');

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('includes the date adapter peer without a direct library import', async ({ page }) => {
    const files = await exportDemo(page, '/x/react-date-pickers/date-picker/', 'BasicDatePicker');
    const source = Object.values(files).find((value) =>
      value.includes('function BasicDatePicker'),
    )!;
    expect(source).toContain('@mui/x-date-pickers/AdapterDayjs');
    expect(source).not.toMatch(/from ['"]dayjs/);
    expect(dependencies(files).dayjs).toBeTruthy();
  });

  test('includes generator peers without direct icon imports', async ({ page }) => {
    const files = await exportDemo(
      page,
      '/x/react-data-grid/pagination/',
      'PaginationModelControlled',
    );
    const deps = dependencies(files);
    expect(deps['@mui/x-data-grid-generator']).toBeTruthy();
    expect(deps['@mui/icons-material']).toBeTruthy();
  });

  test('resolves shared helper imports within the exported project', async ({ page }) => {
    const files = await exportDemo(page, '/x/react-tree-view/quickstart/', 'BasicRichTreeView');
    expect(
      Object.values(files).some((source) => source.includes('export const MUI_X_PRODUCTS')),
    ).toBe(true);

    for (const [file, source] of Object.entries(files)) {
      if (!/\.[jt]sx?$/.test(file)) {
        continue;
      }
      for (const match of source.matchAll(/(?:from\s*|import\s*)['"]([.][^'"]+)['"]/g)) {
        const target = posix.normalize(posix.join(posix.dirname(file), match[1]));
        const candidates = SOURCE_EXTENSIONS.flatMap((extension) => [
          `${target}${extension}`,
          `${target}/index${extension}`,
        ]);
        expect(
          candidates.some((candidate) => candidate in files),
          `${file}: ${match[1]}`,
        ).toBe(true);
      }
    }
  });
});
