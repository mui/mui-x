import { Locator } from '@playwright/test';
import { pickersSectionListClasses } from '@mui/x-date-pickers/PickersSectionList';

export async function setFieldValue(locator: Locator, valueStr: string) {
  const page = locator.page();

  // Focus 1st section
  const firstSection = await locator
    .locator(`.${pickersSectionListClasses.sectionContent}`)
    .first();
  await firstSection.focus();

  // Select the whole value to set `contentEditable={true}` on the root
  await page.keyboard.press(`Control+a`);

  // Type the value on the root
  const pickersSectionListRoot = locator.locator(`.${pickersSectionListClasses.root}`);
  await pickersSectionListRoot.fill(valueStr);

  // We move the focus back to the 1st section
  await page.keyboard.press('ArrowLeft');
}
