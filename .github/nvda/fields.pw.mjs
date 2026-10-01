// `master` = PickersTextField from the PR base, `fixed` = PR head. Same fixtures, same key sequence.
import fs from 'node:fs';
import { nvdaTest as test } from '@guidepup/playwright';
import { expect } from '@playwright/test';

test.use({ nvdaStartOptions: { capture: true } });

const VARIANTS = [
  { name: 'master', baseURL: 'http://localhost:5001' },
  { name: 'fixed', baseURL: 'http://localhost:5002' },
];

const occurrences = (steps, text) =>
  steps.reduce((count, step) => count + step.spokenPhrase.split(text).length - 1, 0);

async function open(page, nvda, baseURL, fixture) {
  await page.goto(`${baseURL}/e2e/DatePicker/${fixture}#no-dev`);
  const before = page.getByRole('button', { name: 'Before' });
  await before.waitFor();
  // NVDA sometimes ends up outside the browser window and stays silent; retry instead of logging nothing.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nvda.navigateToWebContent();
    // eslint-disable-next-line no-await-in-loop
    await page.evaluate(() => document.activeElement?.blur());
    // eslint-disable-next-line no-await-in-loop
    const { spokenPhrase } = await nvda.capture(() => before.focus(), { capture: true });
    if (spokenPhrase.includes('Before')) {
      // eslint-disable-next-line no-await-in-loop
      await nvda.clearSpokenPhraseLog();
      return;
    }
  }
  throw new Error('NVDA is not following the browser: focusing "Before" produced no speech.');
}

// Keys go through Playwright so NVDA browse/focus mode cannot swallow them; NVDA still
// reacts to the resulting focus, value and live region events like with real keystrokes.
async function pressAll(page, nvda, keys) {
  const steps = [];
  for (const key of keys) {
    // eslint-disable-next-line no-await-in-loop
    const { spokenPhrase } = await nvda.capture(() => page.keyboard.press(key), { capture: true });
    steps.push({ key, spokenPhrase });
  }
  return steps;
}

async function report(testInfo, title, steps, counts) {
  const header = `### ${testInfo.project.name} / ${title} (attempt ${testInfo.retry + 1})`;
  const rows = steps.map(
    ({ key, spokenPhrase }, i) =>
      `| ${i} | ${key} | ${spokenPhrase.replaceAll('|', '\\|') || '_(silence)_'} |`,
  );
  const markdown = [
    header,
    '',
    `Counts: \`${JSON.stringify(counts)}\``,
    '',
    '| # | Key | NVDA spoke |',
    '| - | - | - |',
    ...rows,
    '',
  ].join('\n');
  // eslint-disable-next-line no-console
  console.log(markdown);
  await testInfo.attach('nvda-log.json', {
    body: JSON.stringify({ steps, counts }, null, 2),
    contentType: 'application/json',
  });
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }
}

// Firefox moves focus to the top of the page when tabbing out of a non-first section
// (pre-existing, also on master), so every field is left from its first section.
const ACROSS_SECTIONS_AND_BACK = ['ArrowRight', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowLeft'];

for (const { name, baseURL } of VARIANTS) {
  test(`${name}: label is not re-announced while navigating (#23101)`, async ({
    page,
    nvda,
  }, testInfo) => {
    await open(page, nvda, baseURL, 'NvdaLabelRepeat');

    const group = page.getByRole('group', { name: 'Birth date' });
    if (name === 'master') {
      await expect(group).toHaveAttribute('aria-live', 'polite');
    } else {
      await expect(group).not.toHaveAttribute('aria-live');
    }

    const steps = await pressAll(page, nvda, [
      'Tab', // first field, month
      ...ACROSS_SECTIONS_AND_BACK,
      'Tab', // first field "Choose date" button
      'Tab', // second field, month
      ...ACROSS_SECTIONS_AND_BACK,
      'Tab', // second field "Choose date" button
      'Tab', // "After" button, outside both fields
    ]);
    const counts = {
      'Birth date': occurrences(steps, 'Birth date'),
      'Due date': occurrences(steps, 'Due date'),
    };
    await report(testInfo, `${name} / label repeat`, steps, counts);
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();

    if (name === 'master') {
      // Each field is entered once, so any count above 2 is a repeat.
      const reproduced = counts['Birth date'] + counts['Due date'] > 2;
      testInfo.annotations.push({
        type: 'master reproduces #23101',
        description: String(reproduced),
      });
      // Control: the bug was reported on Chrome; without it the `fixed` result proves nothing.
      if (testInfo.project.name === 'chromium') {
        expect.soft(reproduced, 'master should reproduce the bug').toBe(true);
      }
    } else {
      expect.soft(counts['Birth date'], 'first label spoken once').toBe(1);
      expect.soft(counts['Due date'], 'second label spoken once').toBe(1);
      expect
        .soft(steps.at(-1).spokenPhrase, 'label must not leak onto the next element')
        .not.toContain('Due date');
    }
  });

  test(`${name}: helper text changes are still announced (#16637)`, async ({
    page,
    nvda,
  }, testInfo) => {
    await open(page, nvda, baseURL, 'NvdaHelperTextError');

    const steps = await pressAll(page, nvda, [
      'Tab', // month
      'ArrowRight', // day
      'ArrowRight', // year
      'ArrowUp', // 2030 > maxDate: error appears
      'ArrowDown', // 2029: error clears
      'ArrowUp', // error appears again
      'ArrowLeft',
      'ArrowLeft', // back to month
      'Tab', // "Choose date" button
      'Tab', // "After" button
    ]);
    const ERROR = 'Date is too late';
    const announcedNear = (i) => [i, i + 1].some((j) => steps[j]?.spokenPhrase.includes(ERROR));
    const counts = {
      Appointment: occurrences(steps, 'Appointment'),
      [ERROR]: occurrences(steps, ERROR),
    };
    await report(testInfo, `${name} / helper text error`, steps, counts);
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();

    // `master` is logged for comparison only; the fix must keep announcing every error.
    if (name === 'fixed') {
      expect.soft(announcedNear(3), 'first error announced').toBe(true);
      expect.soft(announcedNear(5), 'second error announced').toBe(true);
      expect.soft(counts.Appointment, 'label spoken once').toBe(1);
    }
  });
}
