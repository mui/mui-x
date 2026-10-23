const focusVisibleOffsetVar = '--_focusVisible-offset';
const focusVisibleBehaviorVar = '--_focusVisible-behavior';
const focusVisibleShadowVar = '--_focusVisible-shadow';

export const outsetFocusRing = {
  [focusVisibleOffsetVar]: 1,
  [focusVisibleBehaviorVar]: 'initial',
};

export function applyInsetFocusVisible(offset: number) {
  return {
    [focusVisibleOffsetVar]: -offset,
    [focusVisibleBehaviorVar]: 'inset',
  };
}

export function applyChildrenFocusVisible(color: string) {
  return {
    [focusVisibleShadowVar]: color,
  };
}
