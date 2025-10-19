/* eslint-disable no-console */
import path from 'path';
import fs from 'node:fs/promises';
import { pageToTitle } from 'docs/src/modules/utils/helpers';
import pages from 'docs/data/docs/pages';

async function run() {
  try {
    const translationsFilename = path.join(__dirname, '../translations/translations.json');
    const translationsFile = await fs.readFile(translationsFilename, 'utf8');
    const output = JSON.parse(translationsFile);

    const traverse = (pages2) => {
      pages2.forEach((page) => {
        if (page.pathname.indexOf('/api') === -1 && page.pathname.indexOf('/blog') === -1) {
          const title = pageToTitle(page);

          if (title) {
            const pathname = page.subheader || page.pathname;
            output.pages[pathname] = title;
          }
        }

        if (page.children) {
          traverse(page.children);
        }
      });
    };

    traverse(pages);

    await fs.writeFile(translationsFilename, `${JSON.stringify(output, null, 2)}\n`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

run();
