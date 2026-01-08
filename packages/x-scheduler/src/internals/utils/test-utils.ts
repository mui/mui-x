import { screen } from '@mui/internal-test-utils';

export function getPreferencesMenu() {
  return screen.queryByRole('button', { name: /settings/i });
}

export async function findPreferencesMenu() {
  return screen.findByRole('button', { name: /settings/i });
}

export async function openPreferencesMenu(user) {
  const button = await findPreferencesMenu();
  await user.click(button);
  // MUI Menu doesn't easily expose aria-label, just wait for the menu to appear
  await screen.findByRole('menu');
}

export async function toggleShowWeekends(user) {
  // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
  const menuItem = await screen.findByRole('menuitem', { name: /show weekends/i });
  await user.click(menuItem);
}

export async function toggleShowWeekNumber(user) {
  // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
  const menuItem = await screen.findByRole('menuitem', { name: /show week number/i });
  await user.click(menuItem);
}

export async function toggleShowEmptyDaysInAgenda(user) {
  // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
  const menuItem = await screen.findByRole('menuitem', { name: /show empty days/i });
  await user.click(menuItem);
}

async function openTimeFormatSubmenu(user) {
  const trigger = await screen.findByRole('menuitem', { name: /Time format/i });
  await user.click(trigger);
  // MUI opens a separate menu for submenu items - wait for the time format options to appear
  await screen.findByRole('menuitem', { name: /24-hour/i });
}

export async function changeTo24HoursFormat(user) {
  await openTimeFormatSubmenu(user);
  // MUI MenuItem uses role="menuitem" (not menuitemradio)
  const h24Option = await screen.findByRole('menuitem', { name: /24-hour \(13:00\)/i });
  await user.click(h24Option);
}

export async function changeTo12HoursFormat(user) {
  await openTimeFormatSubmenu(user);
  // MUI MenuItem uses role="menuitem" (not menuitemradio)
  const h12Option = await screen.findByRole('menuitem', { name: /12-hour \(1:00PM\)/i });
  await user.click(h12Option);
}
