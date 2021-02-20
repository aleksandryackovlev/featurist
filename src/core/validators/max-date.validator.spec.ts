import { maxDate } from './max-date.validator';

describe('MaxDate validator', () => {
  const today = new Date();
  const yesterday = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);
  yesterday.setDate(yesterday.getDate() - 1);

  it('should return false for non-string values', () => {
    expect(maxDate(today, today)).toEqual(false);
  });

  it('should return false for invalid datestring values', () => {
    expect(maxDate('some text', today)).toEqual(false);
  });

  it('should return false for dates bigger than the given one', () => {
    expect(maxDate(tomorrow.toUTCString(), today)).toEqual(false);
  });

  it('should return true for dates less than the given one', () => {
    expect(maxDate(yesterday.toUTCString(), today)).toEqual(true);
  });

  it('should return true for dates equal to the given one', () => {
    expect(maxDate(today.toUTCString(), today)).toEqual(true);
  });
});
