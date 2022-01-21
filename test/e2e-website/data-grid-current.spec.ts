import { test as base, expect, Page } from '@playwright/test';
import kebabCase from 'lodash/kebabCase';
import { TestFixture } from './playwright.config';

const test = base.extend<TestFixture>({});

test.describe.parallel('DataGrid docs', () => {
  test('should have correct link with hash in the TOC', async ({ page }) => {
    await page.goto(`/components/data-grid/getting-started/`);

    const anchors = page.locator('[aria-label="Page table of contents"] ul a');

    const firstAnchor = await anchors.first();
    const textContent = await firstAnchor.textContent();

    await expect(firstAnchor).toHaveAttribute(
      'href',
      `/components/data-grid/getting-started/#${kebabCase(textContent || '')}`,
    );
  });

  test.describe.parallel('Demo page', () => {
    test('should have correct link for API section', async ({ page }) => {
      await page.goto(`/components/data-grid/`);

      const anchors = await page.locator('div > h2#heading-api ~ ul a');

      const firstAnchor = await anchors.first();
      const textContent = await firstAnchor.textContent();

      await expect(firstAnchor).toHaveAttribute(
        'href',
        `/api/data-grid/${kebabCase(textContent || '')}/`,
      );
    });

    test('should have correct link for sidebar anchor', async ({ page }) => {
      await page.goto(`/components/data-grid/`);

      const anchor = await page.locator('nav[aria-label="documentation"] ul a:text-is("Overview")');

      await expect(anchor).toHaveAttribute('href', `/components/data-grid/`);
    });
  });

  test.describe.parallel('API page', () => {
    test('should have correct link for sidebar anchor', async ({ page }) => {
      await page.goto(`/api/data-grid/data-grid/`);

      const anchor = await page.locator('nav[aria-label="documentation"] ul a:text-is("DataGrid")');

      await expect(anchor).toHaveAttribute('app-drawer-active', '');
      await expect(anchor).toHaveAttribute('href', `/api/data-grid/data-grid/`);
    });

    test('all the links in the main content should have correct prefix', async ({ page }) => {
      await page.goto(`/api/data-grid/data-grid/`);

      const anchors = await page.locator('div#main-content a');

      const handles = await anchors.elementHandles();

      const links = await Promise.all(handles.map((elm) => elm.getAttribute('href')));

      links.forEach((link) => {
        expect(link?.startsWith('/x/data-grid')).toBeFalsy();
      });
    });
  });

  test.describe.parallel('Search', () => {
    const retryToggleSearch = async (page: Page, count = 3) => {
      try {
        await page.keyboard.press('Meta+k');
        await page.waitForSelector('input#docsearch-input', { timeout: 2000 });
      } catch (error) {
        if (count === 0) {
          throw error;
        }
        await retryToggleSearch(page, count - 1);
      }
    };
    test('should have correct link when searching component', async ({ page }) => {
      await page.goto(`/components/data-grid/getting-started/`, { waitUntil: 'networkidle' });

      await retryToggleSearch(page);

      await page.type('input#docsearch-input', 'datagrid', { delay: 50 });

      const anchor = await page.locator('.DocSearch-Hits a:has-text("Data Grid - Components")');

      await expect(anchor.first()).toHaveAttribute(
        'href',
        `/components/data-grid/components/#main-content`,
      );
    });

    test('should have correct link when searching API', async ({ page }) => {
      await page.goto(`/components/data-grid/getting-started/`, { waitUntil: 'networkidle' });

      await retryToggleSearch(page);

      await page.type('input#docsearch-input', 'datagrid api', { delay: 50 });

      const anchor = await page.locator('.DocSearch-Hits a:has-text("DataGrid API")');

      await expect(anchor.first()).toHaveAttribute(
        'href',
        `/api/data-grid/data-grid/#main-content`,
      );
    });

    test('should have correct link when searching pro API', async ({ page }) => {
      await page.goto(`/components/data-grid/getting-started/`);

      await page.waitForLoadState('networkidle'); // wait for docsearch

      await retryToggleSearch(page);

      await page.type('input#docsearch-input', 'datagridpro api', { delay: 50 });

      const anchor = await page.locator('.DocSearch-Hits a:has-text("DataGridPro API")');

      await expect(anchor.first()).toHaveAttribute(
        'href',
        `/api/data-grid/data-grid-pro/#main-content`,
      );
    });
  });
});
