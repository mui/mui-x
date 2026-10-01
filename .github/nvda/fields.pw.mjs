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
  await nvda.navigateToWebContent();
  await nvda.capture(() => before.focus(), { capture: true });
  await nvda.clearSpokenPhraseLog();
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
      'ArrowRight', // day
      'ArrowRight', // year
      'ArrowUp', // year value change
      'Tab', // first field "Choose date" button
      'Tab', // second field, month
      'ArrowRight',
      'ArrowRight',
      'Tab', // second field "Choose date" button
      'Tab', // "After" button, outside both fields
    ]);
    const counts = {
      'Birth date': occurrences(steps, 'Birth date'),
      'Due date': occurrences(steps, 'Due date'),
    };
    await report(testInfo, `${name} / label repeat`, steps, counts);

    if (name === 'master') {
      // Control: the harness must reproduce the bug, otherwise the `fixed` result proves nothing.
      expect
        .soft(counts['Birth date'] + counts['Due date'], 'master should reproduce the bug')
        .toBeGreaterThan(2);
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

    expect.soft(announcedNear(3), 'first error announced').toBe(true);
    expect.soft(announcedNear(5), 'second error announced').toBe(true);
    if (name === 'fixed') {
      expect.soft(counts.Appointment, 'label spoken once').toBe(1);
    }
  });
}
