// What NVDA must say when using a date field with the keyboard.
// Each test opens a page from `test/e2e/fixtures/DatePicker`, presses keys one at a time,
// and checks the speech produced by each key. Runs on Windows CI only (`nvda-verify.yml`).
import fs from 'node:fs';
import { nvdaTest as test } from '@guidepup/playwright';
import { expect } from '@playwright/test';

test.use({ nvdaStartOptions: { capture: true } });

function log(line) {
  // eslint-disable-next-line no-console
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
  }
}

// Opens the page with focus on its "Before" button, right before the field.
async function openPage(page, nvda, fixture) {
  log(`\n### ${test.info().project.name}: ${test.info().title}\n`);
  await page.goto(`/e2e/DatePicker/${fixture}#no-dev`);
  const before = page.getByRole('button', { name: 'Before' });
  await before.waitFor();
  // NVDA is sometimes not attached to the browser window yet: retry until it speaks.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nvda.navigateToWebContent();
    // eslint-disable-next-line no-await-in-loop
    await page.evaluate(() => document.activeElement?.blur());
    // eslint-disable-next-line no-await-in-loop
    const { spokenPhrase } = await nvda.capture(() => before.focus(), { capture: true });
    if (spokenPhrase.includes('Before')) {
      return;
    }
  }
  throw new Error('NVDA is not following the browser: focusing "Before" produced no speech.');
}

// Presses a key and returns everything NVDA said until it went quiet.
async function press(page, nvda, key) {
  const { spokenPhrase } = await nvda.capture(() => page.keyboard.press(key), { capture: true });
  log(`- \`${key}\`: ${spokenPhrase || '(silence)'}`);
  return spokenPhrase;
}

const timesSaid = (spoken, text) => spoken.split(text).length - 1;

test.describe('date field with a label and a helper text', () => {
  const LABEL = 'Start date';
  const HELPER_TEXT = 'Pick any weekday';

  test('reads the label and the helper text once when focus enters the field', async ({
    page,
    nvda,
  }) => {
    await openPage(page, nvda, 'NvdaFieldWithHelperText');

    const spoken = await press(page, nvda, 'Tab');

    expect.soft(spoken).toContain('Month');
    expect.soft(timesSaid(spoken, LABEL), 'label').toBe(1);
    expect.soft(timesSaid(spoken, HELPER_TEXT), 'helper text').toBe(1);
  });

  test('does not read the label again while moving between sections or changing a value', async ({
    page,
    nvda,
  }) => {
    await openPage(page, nvda, 'NvdaFieldWithHelperText');
    await press(page, nvda, 'Tab');

    for (const key of ['ArrowRight', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowLeft']) {
      // eslint-disable-next-line no-await-in-loop
      expect.soft(await press(page, nvda, key), key).not.toContain(LABEL);
    }
  });

  test('does not read the label once focus moves to the next elements', async ({ page, nvda }) => {
    await openPage(page, nvda, 'NvdaFieldWithHelperText');
    await press(page, nvda, 'Tab');
    await press(page, nvda, 'ArrowRight');
    // Back to the first section: in Firefox, Tab from a later section jumps to the top of the page.
    await press(page, nvda, 'ArrowLeft');

    const openButton = await press(page, nvda, 'Tab');
    expect.soft(openButton).toContain('Choose date');
    expect.soft(openButton).not.toContain(LABEL);

    const nextButton = await press(page, nvda, 'Tab');
    expect.soft(nextButton).toContain('After');
    expect.soft(nextButton).not.toContain(LABEL);
  });
});

test.describe('date field with a validation error in the helper text', () => {
  const LABEL = 'End date';
  const ERROR = 'Date is too late';

  test('announces the error every time it appears, without the label', async ({ page, nvda }) => {
    await openPage(page, nvda, 'NvdaFieldValidation');
    await press(page, nvda, 'Tab'); // month
    await press(page, nvda, 'ArrowRight'); // day
    await press(page, nvda, 'ArrowRight'); // year, 2029 = maxDate

    const tooLate = await press(page, nvda, 'ArrowUp'); // 2030
    expect.soft(tooLate, '2030').toContain(ERROR);
    expect.soft(tooLate, '2030').not.toContain(LABEL);

    const valid = await press(page, nvda, 'ArrowDown'); // 2029
    expect.soft(valid, '2029').not.toContain(ERROR);
    expect.soft(valid, '2029').not.toContain(LABEL);

    const tooLateAgain = await press(page, nvda, 'ArrowUp'); // 2030
    expect.soft(tooLateAgain, '2030 again').toContain(ERROR);
    expect.soft(tooLateAgain, '2030 again').not.toContain(LABEL);
  });
});
