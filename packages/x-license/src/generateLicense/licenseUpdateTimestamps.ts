// according to this section on the licensing notion page:
// https://www.notion.so/mui-org/mui-x-License-validation-after-Pro-plan-with-no-cap-91fa2d16a1eb4c58825f332654196c1a?pvs=4#d26e7747aa1341d299eac49145d57edb
export const LICENSE_UPDATE_TIMESTAMPS = {
  // 2024-06-20: to include charts-pro and tree-view-pro, but allow for legacy licenses
  '2024-06': new Date(2024, 5, 20, 0, 0, 0, 0).getTime(),
  // 2024-07-20: to fully support charts-pro and tree-view-pro on all licenses generated after this date
  '2024-07': new Date(2024, 6, 20, 0, 0, 0, 0).getTime(),
};
