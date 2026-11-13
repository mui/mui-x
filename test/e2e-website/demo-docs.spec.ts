import { createRequire } from 'node:module';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const requireFromDocs = createRequire(path.resolve('docs/package.json'));
const LZString = requireFromDocs('lz-string');
const GRID_PATH = '/x/react-data-grid/';
const DEMO_NAME = 'DataGridDemo';
const SHORT_SNIPPET_LINES = 12;
const EDITED_SOURCE = 'export default function DataGridDemo() { return <div>Edited live</div>; }';

interface Submission {
  action: string;
  fields: Record<string, string>;
}

type ExportWindow = typeof window & { demoSubmissions: Submission[] };

function getDemo(page: Page, name = DEMO_NAME) {
  return page.locator(`#${name}`).locator('..');
}

async function readyDemo(page: Page, name = DEMO_NAME) {
  const demo = getDemo(page, name);
  await expect(async () => {
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.getByRole('toolbar', { name: 'demo source' })).not.toHaveAttribute(
      'aria-busy',
      'true',
    );
  }).toPass({ timeout: 15_000 });
  return demo;
}

async function editor(demo: Locator) {
  const textarea = demo.locator('textarea:visible');
  if ((await textarea.count()) === 0) {
    await demo.getByRole('group', { name: 'Editable code' }).first().click();
  }
  await textarea.waitFor();
  return textarea;
}

async function openSource(page: Page) {
  const demo = await readyDemo(page);
  await demo.getByRole('button', { name: 'Show code', exact: true }).click();
  return demo;
}

function decodeSandbox(parameters: string) {
  const base64 = parameters.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(LZString.decompressFromBase64(base64));
}

test.describe('Migrated demo docs', () => {
  test.skip(!process.env.PLAYWRIGHT_TEST_BASE_URL, 'Set the migrated docs build URL explicitly.');
  test.use({
    viewport: { width: 1280, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'codeVariant', value: 'TS', url: process.env.PLAYWRIGHT_TEST_BASE_URL! },
    ]);
  });

  test('renders the bundled grid and highlighted editable source', async ({ page }) => {
    await page.goto(`${GRID_PATH}#data-grid-packages`);
    const demo = await openSource(page);
    await expect(demo.getByRole('grid')).toBeVisible();
    await expect(demo.getByRole('columnheader', { name: 'First name' })).toBeVisible();
    await expect(await editor(demo)).toHaveValue(/export default function DataGridDemo/);
    await expect(demo.locator('pre code.language-tsx [class^="pl-"]')).not.toHaveCount(0);
    await expect(demo.getByRole('button', { name: 'Hide code', exact: true })).toHaveAttribute(
      'aria-controls',
      /demo-source-/,
    );
  });

  test('shows and hides source for a closed-source demo', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await readyDemo(page);
    await expect(demo.locator('textarea')).toHaveCount(0);
    await demo.getByRole('button', { name: 'Show code', exact: true }).click();
    await expect(await editor(demo)).toHaveValue(/export default function DataGridDemo/);
    await demo.getByRole('button', { name: 'Hide code', exact: true }).click();
    await expect(demo.locator('textarea')).toHaveCount(0);
    await expect(demo.getByRole('button', { name: 'Show code', exact: true })).toBeVisible();
  });

  test('runs edited source in place', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    await (await editor(demo)).fill(EDITED_SOURCE);
    await expect(demo.getByText('Edited live', { exact: true })).toBeVisible();
    await expect(demo.locator('pre code')).toContainText('Edited live');
  });

  test('keeps the last valid render after a syntax error', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    const textarea = await editor(demo);
    await textarea.fill(EDITED_SOURCE);
    await expect(demo.getByText('Edited live', { exact: true })).toBeVisible();
    await textarea.fill('export default function DataGridDemo() { return <div>');
    await expect(demo.getByRole('alert').filter({ hasText: 'SyntaxError' })).toBeVisible();
    await expect(demo.getByText('Edited live', { exact: true })).toBeVisible();
  });

  test('resets edited source and restores the bundled grid', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    await (await editor(demo)).fill(EDITED_SOURCE);
    await expect(demo.getByText('Edited live', { exact: true })).toBeVisible();
    await demo.getByRole('button', { name: 'Reset demo', exact: true }).click();
    await expect(demo.getByRole('grid')).toBeVisible();
    await expect(await editor(demo)).toHaveValue(/export default function DataGridDemo/);
    await expect(await editor(demo)).not.toHaveValue(/Edited live/);
  });

  test('remounts grid selection state when reset', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await readyDemo(page);
    const checkbox = demo.getByRole('checkbox').nth(1);
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await demo.getByRole('button', { name: 'Reset demo', exact: true }).click();
    await expect(checkbox).not.toBeChecked();
  });

  test('supports keyboard entry and exit for the editor', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    const group = demo.getByRole('group', { name: 'Editable code' });
    await group.focus();
    await page.keyboard.press('Enter');
    await expect(demo.locator('textarea')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(group).toBeFocused();
  });

  test('switches languages, resets edits, and persists the preference', async ({ page }) => {
    await page.goto(`${GRID_PATH}#${DEMO_NAME}.jsx`);
    const demo = await readyDemo(page);
    const textarea = await editor(demo);
    await expect(demo.getByRole('button', { name: 'Show JavaScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(textarea).not.toHaveValue(/GridColDef</);
    await textarea.fill(EDITED_SOURCE);
    await expect(demo.getByText('Edited live', { exact: true })).toBeVisible();
    await demo.getByRole('button', { name: 'Show TypeScript source' }).click();
    await expect(textarea).not.toHaveValue(/Edited live/);
    await expect(textarea).toHaveValue(/GridColDef</);
    await expect
      .poll(
        async () =>
          (await page.context().cookies()).find(({ name }) => name === 'codeVariant')?.value,
      )
      .toBe('TS');
    await page.goto(GRID_PATH);
    const reloaded = await openSource(page);
    await expect(reloaded.getByRole('button', { name: 'Show TypeScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(await editor(reloaded)).toHaveValue(/GridColDef</);
  });

  test('hydrates with a language chosen after navigation starts', async ({ page, context }) => {
    const origin = new URL(process.env.PLAYWRIGHT_TEST_BASE_URL!).origin;
    await context.addCookies([{ name: 'codeVariant', value: 'JS', url: origin }]);
    let releaseRequest!: () => void;
    const requestGate = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });
    await page.route(`**${GRID_PATH}`, async (route) => {
      await requestGate;
      await route.continue();
    });
    const navigation = page.goto(GRID_PATH);
    try {
      await context.addCookies([{ name: 'codeVariant', value: 'TS', url: origin }]);
    } finally {
      releaseRequest();
    }
    await navigation;
    const demo = await openSource(page);
    await expect(demo.getByRole('button', { name: 'Show TypeScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(await editor(demo)).toHaveValue(/GridColDef</);
  });

  test('copies original source from the active relative module tab', async ({ page }) => {
    await page.goto('/x/react-tree-view/rich-tree-view/lazy-loading/#LazyLoadingInitialState.tsx');
    const demo = await readyDemo(page, 'LazyLoadingInitialState');
    await demo.getByRole('tab', { name: 'items.ts', exact: true }).click();
    const textarea = await editor(demo);
    await textarea.fill((await textarea.inputValue()).replace('Amy Harris', 'Edited shared item'));
    await expect(
      demo.getByRole('treeitem', { name: 'Edited shared item', exact: true }),
    ).toBeVisible();
    await demo.getByRole('button', { name: 'Copy the source', exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('Amy Harris');
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('ItemType');
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .not.toContain('Edited shared item');
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .not.toContain('function LazyLoadingInitialState');
  });

  test('shows a focused snippet longer than twelve lines', async ({ page }) => {
    await page.goto('/x/react-data-grid/column-dimensions/');
    const demo = await readyDemo(page, 'ColumnSizingGrid');
    expect(
      Number(await demo.locator('pre > code').getAttribute('data-focused-lines')),
    ).toBeGreaterThan(SHORT_SNIPPET_LINES);
    await expect(await editor(demo)).toHaveValue(/^<DataGrid/);
  });

  test('links the authored TypeScript file for either source language', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    async function checkLink(language: 'TypeScript' | 'JavaScript') {
      await demo.getByRole('button', { name: `Show ${language} source` }).click();
      await demo.getByRole('button', { name: 'See more' }).click();
      const link = page.getByRole('menuitem', { name: 'View the source on GitHub' });
      await expect(link).toHaveAttribute(
        'href',
        /github\.com\/[^/]+\/mui-x\/blob\/[^/]+\/docs\/data\/data-grid\/overview\/demos\/data-grid-demo\/DataGridDemo\.tsx$/,
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await page.keyboard.press('Escape');
    }
    await checkLink('TypeScript');
    await checkLink('JavaScript');
  });

  test('copies source links from the overflow menu', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await readyDemo(page);
    async function checkCopy(language: 'JavaScript' | 'TypeScript', extension: 'jsx' | 'tsx') {
      await demo.getByRole('button', { name: 'See more' }).click();
      await page.getByRole('menuitem', { name: `Copy link to ${language} source` }).click();
      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(
          new URL(`${GRID_PATH}#${DEMO_NAME}.${extension}`, process.env.PLAYWRIGHT_TEST_BASE_URL)
            .href,
        );
      await expect(page.getByRole('menu')).toBeHidden();
    }
    await checkCopy('JavaScript', 'jsx');
    await checkCopy('TypeScript', 'tsx');
  });

  test('copies original source after live editing', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    await (await editor(demo)).fill(EDITED_SOURCE);
    await expect(demo.getByText('Edited live', { exact: true })).toBeVisible();
    await demo.getByRole('button', { name: 'Copy the source', exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain("import { DataGrid } from '@mui/x-data-grid';");
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .not.toContain('Edited live');
  });

  test('generates StackBlitz and CodeSandbox submissions', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'demoSubmissions', { value: [] });
      HTMLFormElement.prototype.submit = function capture() {
        (window as ExportWindow).demoSubmissions.push({
          action: this.action,
          fields: Object.fromEntries(new FormData(this).entries()) as Record<string, string>,
        });
      };
    });
    await page.goto(GRID_PATH);
    const demo = await readyDemo(page);
    await demo.getByRole('button', { name: 'Edit in StackBlitz', exact: true }).click();
    await demo.getByRole('button', { name: 'Edit in CodeSandbox', exact: true }).click();
    const submissions = await page.evaluate(() => (window as ExportWindow).demoSubmissions);
    expect(submissions).toHaveLength(2);
    expect(submissions[0].action).toBe('https://stackblitz.com/run?file=src/Demo.tsx');
    expect(submissions[0].fields['project[files][src/Demo.tsx]']).toContain(
      'function DataGridDemo',
    );
    expect(submissions[0].fields['project[files][package.json]']).toContain('"vite"');
    expect(submissions[1].action).toBe('https://codesandbox.io/api/v1/sandboxes/define');
    const project = decodeSandbox(submissions[1].fields.parameters);
    expect(project.files['src/Demo.tsx'].content).toContain('function DataGridDemo');
    expect(project.files['src/index.tsx'].content).toContain('<App />');
    expect(project.files['tsconfig.json'].content).toContain('"strict": true');
    expect(JSON.parse(project.files['package.json'].content).dependencies).toHaveProperty(
      '@mui/x-data-grid',
    );
    expect(submissions[1].fields.query).toBe('file=src/Demo.tsx');
  });

  test('supports toolbar keyboard navigation', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await readyDemo(page);
    await demo.getByRole('button', { name: 'Show code', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      demo.getByRole('button', { name: 'Edit in StackBlitz', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('End');
    await expect(demo.getByRole('button', { name: 'See more' })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(demo.getByRole('button', { name: 'Edit in Chat', exact: true })).toBeFocused();
  });

  test('resets focus to the demo start', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await readyDemo(page);
    await demo.getByRole('button', { name: 'Reset focus to test keyboard navigation' }).click();
    await expect(
      demo.getByRole('button', {
        name: 'A generic container that is programmatically focused to test keyboard navigation of our components.',
      }),
    ).toBeFocused();
  });

  test('shows runtime errors and recovers on reset', async ({ page }) => {
    await page.goto(GRID_PATH);
    const demo = await openSource(page);
    await (await editor(demo)).fill("throw new Error('Runtime crash');");
    await expect(demo.getByRole('alert').filter({ hasText: 'Runtime crash' })).toBeVisible();
    await demo.getByRole('button', { name: 'Reset demo', exact: true }).click();
    await expect(demo.getByRole('grid')).toBeVisible();
    await expect(demo.getByRole('alert').filter({ hasText: 'Runtime crash' })).toHaveCount(0);
  });

  test('lands a source deep link on the expanded toolbar', async ({ page }) => {
    await page.goto(`${GRID_PATH}#${DEMO_NAME}.jsx`);
    const demo = getDemo(page);
    await expect(demo.getByRole('button', { name: 'Hide code', exact: true })).toBeVisible();
    const toolbar = demo.getByRole('toolbar', { name: 'demo source' });
    await expect.poll(async () => (await toolbar.boundingBox())?.y).toBeGreaterThan(40);
    await expect.poll(async () => (await toolbar.boundingBox())?.y).toBeLessThan(90);
    await expect(demo.getByRole('button', { name: 'Show JavaScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(demo.locator('.carbonads')).toHaveCount(0);
  });
});
