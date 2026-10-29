import { test, expect, type Locator, type Page } from '@playwright/test';

const ITEMS_PATH = '/x/react-tree-view/simple-tree-view/items/';
const QUICKSTART_PATH = '/x/react-tree-view/quickstart/';
const LAZY_PATH = '/x/react-tree-view/rich-tree-view/lazy-loading/';

function getDemo(page: Page, name: string) {
  return page.locator(`#${name}`).locator('..');
}

async function readyDemo(page: Page, name: string) {
  const demo = getDemo(page, name);
  // Hydration can replace the loading container while Playwright is scrolling it.
  // Scroll before waiting for the live toolbar so below-fold demos can load.
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

async function clickForEffect(target: Locator, expectation: () => Promise<void>) {
  await expect(async () => {
    await target.click();
    await expectation();
  }).toPass({ timeout: 15_000 });
}

test.describe('Tree View docs-infra migration', () => {
  // These checks require an explicitly supplied migrated docs build URL.
  test.skip(!process.env.PLAYWRIGHT_TEST_BASE_URL, 'Set the migrated docs build URL explicitly.');

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('server renders the preview and plain source without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL,
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(QUICKSTART_PATH);
      const demo = getDemo(page, 'BasicRichTreeView');
      await expect(demo.getByRole('treeitem', { name: 'Data Grid', exact: true })).toBeVisible();
      await expect(demo.locator('pre code')).toContainText('<RichTreeView');
      await expect(demo.locator('pre code')).not.toContainText('@focus');
      await expect(demo.locator('textarea')).toHaveCount(0);
    } finally {
      await context.close();
    }
  });

  test('hides focus directives in collapsed and expanded source for both languages', async ({
    page,
  }) => {
    await page.goto(QUICKSTART_PATH);
    const demo = await readyDemo(page, 'BasicRichTreeView');
    const code = demo.locator('pre code');
    await expect(code).toContainText('<RichTreeView');
    await expect(code).not.toContainText('@focus');
    await demo.locator('button[data-ga-event-action="expand"]').click();
    async function checkSourceLanguage(language: 'JavaScript' | 'TypeScript') {
      await demo.getByRole('button', { name: `Show ${language} source` }).click();
      await expect(code).toContainText('export default function BasicRichTreeView');
      await expect(code).not.toContainText('@focus');
    }
    await checkSourceLanguage('JavaScript');
    await checkSourceLanguage('TypeScript');
  });

  test('shows toolbar controls before scripts load and keeps their height', async ({ page }) => {
    let releaseScripts!: () => void;
    const scriptsReady = new Promise<void>((resolve) => {
      releaseScripts = resolve;
    });
    await page.route('**/_next/static/**/*.js', async (route) => {
      await scriptsReady;
      await route.continue();
    });
    try {
      await page.goto(ITEMS_PATH, { waitUntil: 'commit' });
      const toolbar = getDemo(page, 'BasicSimpleTreeView').getByRole('toolbar', {
        name: 'demo source',
      });
      await expect(toolbar).toHaveAttribute('aria-busy', 'true');
      await expect(toolbar.locator('button[data-ga-event-action="expand"]')).toBeVisible();
      await expect(toolbar.locator('button[data-ga-event-action="copy"]')).toBeVisible();
      const loadingHeight = await toolbar.evaluate(
        (element) => element.getBoundingClientRect().height,
      );
      releaseScripts();
      await readyDemo(page, 'BasicSimpleTreeView');
      expect(
        await toolbar.evaluate((element) => element.getBoundingClientRect().height),
      ).toBeCloseTo(loadingHeight, 2);
    } finally {
      releaseScripts();
    }
  });

  test('source deep links select the language and override the stored preference', async ({
    page,
  }) => {
    await page.goto(`${ITEMS_PATH}#BasicSimpleTreeView.jsx`);
    let demo = await readyDemo(page, 'BasicSimpleTreeView');
    await expect(demo.locator('button[data-ga-event-action="expand"]')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(demo.getByRole('button', { name: 'Show JavaScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await demo.getByRole('button', { name: 'Show TypeScript source' }).click();
    await expect(demo.getByRole('button', { name: 'Show TypeScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.evaluate(() => {
      document.cookie = 'codeVariant=JS;path=/';
    });
    await page.goto(`${ITEMS_PATH}#BasicSimpleTreeView.tsx`);
    demo = await readyDemo(page, 'BasicSimpleTreeView');
    await expect(demo.getByRole('button', { name: 'Show TypeScript source' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(await editor(demo)).toHaveValue(/export default function BasicSimpleTreeView/);
  });

  test('live source editing changes a tree label and expansion resets the edit', async ({
    page,
  }) => {
    await page.goto(`${ITEMS_PATH}#BasicSimpleTreeView.tsx`);
    const demo = await readyDemo(page, 'BasicSimpleTreeView');
    const textarea = await editor(demo);
    const source = await textarea.inputValue();
    expect(source).toContain('label="Data Grid"');
    await textarea.fill(source.replace('label="Data Grid"', 'label="Edited live tree"'));
    await expect(
      demo.getByRole('treeitem', { name: 'Edited live tree', exact: true }),
    ).toBeVisible();
    await demo.locator('button[data-ga-event-action="expand"]').click();
    await clickForEffect(demo.locator('button[data-ga-event-action="expand"]'), async () => {
      await expect(demo.getByRole('treeitem', { name: 'Data Grid', exact: true })).toBeVisible({
        timeout: 2000,
      });
    });
    await expect(await editor(demo)).not.toHaveValue(/Edited live tree/);
  });

  test('collects and edits a shared TypeScript dependency outside the demo directory', async ({
    page,
  }) => {
    await page.goto(`${LAZY_PATH}#LazyLoadingInitialState.tsx`);
    const demo = await readyDemo(page, 'LazyLoadingInitialState');
    await demo.getByRole('tab', { name: 'items.ts', exact: true }).click();
    const textarea = await editor(demo);
    const source = await textarea.inputValue();
    expect(source).toContain('Amy Harris');
    expect(source).toContain('ItemType');
    await textarea.fill(source.replace('Amy Harris', 'Edited shared item'));
    await expect(
      demo.getByRole('treeitem', { name: 'Edited shared item', exact: true }),
    ).toBeVisible();
    await demo.locator('button[data-ga-event-action="expand"]').click();
    await demo.locator('button[data-ga-event-action="expand"]').click();
    await expect(demo.getByRole('treeitem', { name: 'Amy Harris', exact: true })).toBeVisible();
  });

  test('copies and exports original source and links the moved authored file', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`${ITEMS_PATH}#BasicSimpleTreeView.tsx`);
    const demo = await readyDemo(page, 'BasicSimpleTreeView');
    await page.evaluate(() => {
      HTMLFormElement.prototype.submit = function captureSubmission() {
        (window as typeof window & { exportedSource?: string }).exportedSource = Array.from(
          new FormData(this).values(),
          String,
        ).join('\n');
      };
    });
    const textarea = await editor(demo);
    await textarea.fill(
      (await textarea.inputValue()).replace('label="Data Grid"', 'label="Edited export tree"'),
    );
    await expect(
      demo.getByRole('treeitem', { name: 'Edited export tree', exact: true }),
    ).toBeVisible();
    await demo.getByRole('button', { name: 'Copy the source' }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('Data Grid');
    expect(await page.evaluate(() => navigator.clipboard.readText())).not.toContain(
      'Edited export tree',
    );
    await demo.getByRole('button', { name: 'Edit in StackBlitz' }).click();
    await expect
      .poll(() =>
        page.evaluate(() => (window as typeof window & { exportedSource?: string }).exportedSource),
      )
      .toContain('Data Grid');
    expect(
      await page.evaluate(
        () => (window as typeof window & { exportedSource?: string }).exportedSource,
      ),
    ).not.toContain('Edited export tree');
    await demo.getByRole('button', { name: 'See more' }).click();
    const link = page.getByRole('menuitem', { name: 'View the source on GitHub' });
    await expect(link).toHaveAttribute(
      'href',
      /github\.com\/[^/]+\/mui-x\/blob\/[^/]+\/docs\/data\/tree-view\/simple-tree-view\/items\/demos\/basic-simple-tree-view\/BasicSimpleTreeView\.tsx$/,
    );
    await page.keyboard.press('Escape');
    await demo.getByRole('button', { name: 'Show JavaScript source' }).click();
    await demo.getByRole('button', { name: 'See more' }).click();
    await expect(link).toHaveAttribute('href', /BasicSimpleTreeView\.tsx$/);
  });
});
