import { test as base, expect, Page } from '@playwright/test';
import kebabCase from 'lodash/kebabCase';
import { TestFixture } from './playwright.config';

const test = base.extend<TestFixture>({});

test.describe('DataGrid docs', () => {
  test('should have correct link with hash in the TOC', async ({ page }) => {
    await page.goto(`/x/react-data-grid/getting-started/`);

    const anchors = page.locator('[aria-label="Page table of contents"] ul a');

    const firstAnchor = anchors.first();
    const textContent = await firstAnchor.textContent();

    await expect(firstAnchor).toHaveAttribute(
      'href',
      `/x/react-data-grid/getting-started/#${kebabCase(textContent || '')}`,
    );
  });

  test.describe('Demo page', () => {
    test('should have correct link for API section', async ({ page }) => {
      await page.goto(`/x/react-data-grid/`);

      const anchors = page.locator('div > h2#api ~ ul a');

      const firstAnchor = anchors.first();
      const textContent = await firstAnchor.textContent();

      await expect(firstAnchor).toHaveAttribute(
        'href',
        `/x/api/data-grid/${kebabCase(textContent || '')}/`,
      );
    });

    test('should have correct link for sidebar anchor', async ({ page }) => {
      await page.goto(`/x/react-data-grid/`);

      const anchor = page.locator('nav[aria-label="documentation"] ul ul a:text-is("Overview")');
      await anchor.waitFor();

      await expect(anchor).toHaveAttribute('app-drawer-active', '');
      await expect(anchor).toHaveAttribute('href', `/x/react-data-grid/`);
    });
  });

  test.describe('API page', () => {
    test('should have correct link for sidebar anchor', async ({ page }) => {
      await page.goto(`/x/api/data-grid/data-grid/`);

      const anchor = page.locator('nav[aria-label="documentation"] ul ul a:text-is("DataGrid")');
      await anchor.waitFor();

      await expect(anchor).toHaveAttribute('app-drawer-active', '');
      await expect(anchor).toHaveAttribute('href', `/x/api/data-grid/data-grid/`);
    });

    test('all the links in the main content should have correct prefix', async ({ page }) => {
      await page.goto(`/x/api/data-grid/`);

      const anchors = page.locator('div#main-content a');

      const handles = await anchors.elementHandles();

      const links = await Promise.all(handles.map((elm) => elm.getAttribute('href')));

      links.forEach((link) => {
        if (link?.startsWith('/x/api/')) {
          expect(link).toMatch(/\/x\/api\/data-grid\/.*/);
        }

        expect(link).not.toMatch(/\/components/); // there should be no `/components` in the url anymore
      });
    });
  });

  // TODO: Enable these tests once the doc space searching is complete
  //
  // test.describe('Search', () => {
  //   const retryToggleSearch = async (page: Page, count = 3) => {
  //     try {
  //       await page.keyboard.press('Meta+k');
  //       await page.waitForSelector('input#docsearch-input', { timeout: 2000 });
  //     } catch (error) {
  //       if (count === 0) {
  //         throw error;
  //       }
  //       await retryToggleSearch(page, count - 1);
  //     }
  //   };
  //   test('should have correct link when searching component', async ({ page }) => {
  //     await page.goto(`/x/react-data-grid/getting-started/`);

  //     await retryToggleSearch(page);

  //     await page.type('input#docsearch-input', 'datagrid', { delay: 50 });

  //     const anchor = page.locator('.DocSearch-Hits a:has-text("Data Grid - Components")').first();
  //     await anchor.waitFor();

  //     await expect(anchor).toHaveAttribute(
  //       'href',
  //       `/x/react-data-grid/components/#main-content`,
  //     );
  //   });

  //   test('should have correct link when searching API', async ({ page }) => {
  //     await page.goto(`/x/react-data-grid/getting-started/`);

  //     await retryToggleSearch(page);

  //     await page.type('input#docsearch-input', 'datagrid api', { delay: 50 });

  //     const anchor = page.locator('.DocSearch-Hits a:has-text("DataGrid API")').first();
  //     await anchor.waitFor();

  //     await expect(anchor).toHaveAttribute(
  //       'href',
  //       `/x/api/data-grid/data-grid/#main-content`,
  //     );
  //   });

  //   test('should have correct link when searching pro API', async ({ page }) => {
  //     await page.goto(`/x/react-data-grid/getting-started/`);

  //     await retryToggleSearch(page);

  //     await page.type('input#docsearch-input', 'datagridpro api', { delay: 50 });

  //     const anchor = page.locator('.DocSearch-Hits a:has-text("DataGridPro API")').first();
  //     await anchor.waitFor();

  //     await expect(anchor).toHaveAttribute(
  //       'href',
  //       `/x/api/data-grid/data-grid-pro/#main-content`,
  //     );
  //   });
  // });
});
