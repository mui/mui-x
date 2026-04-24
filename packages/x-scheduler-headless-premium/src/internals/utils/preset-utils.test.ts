import { getPresetPxPerDay } from './preset-utils';

describe('getPresetPxPerDay', () => {
  // Concrete values prove the derivation formula `tickWidth × ticksPerDay[timeResolution]`
  // rather than the incidental fact that the canonical zoom order happens to match alphabetical
  // for the built-in presets.
  it('should return tickWidth × 24 for hour-resolution presets', () => {
    expect(getPresetPxPerDay('dayAndHour')).to.equal(64 * 24);
  });

  it('should return tickWidth for day-resolution presets', () => {
    expect(getPresetPxPerDay('dayAndMonth')).to.equal(120);
    expect(getPresetPxPerDay('dayAndWeek')).to.equal(64);
    expect(getPresetPxPerDay('monthAndYear')).to.equal(6);
  });

  it('should return tickWidth / 365 for year-resolution presets', () => {
    expect(getPresetPxPerDay('year')).to.be.closeTo(200 / 365, 0.001);
  });

  it('should rank presets monotonically from most to least zoomed-in', () => {
    expect(getPresetPxPerDay('dayAndHour')).to.be.greaterThan(getPresetPxPerDay('dayAndMonth'));
    expect(getPresetPxPerDay('dayAndMonth')).to.be.greaterThan(getPresetPxPerDay('dayAndWeek'));
    expect(getPresetPxPerDay('dayAndWeek')).to.be.greaterThan(getPresetPxPerDay('monthAndYear'));
    expect(getPresetPxPerDay('monthAndYear')).to.be.greaterThan(getPresetPxPerDay('year'));
  });
});
