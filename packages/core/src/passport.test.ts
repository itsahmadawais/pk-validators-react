import { describe, expect, it } from 'vitest';
import { validatePassport } from './passport';

describe('validatePassport', () => {
  it('treats empty input as incomplete, not invalid', () => {
    const r = validatePassport('');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(true);
  });

  it('treats a plausible partial value as incomplete', () => {
    expect(validatePassport('A').incomplete).toBe(true);
    expect(validatePassport('AB').incomplete).toBe(true);
    expect(validatePassport('AB123').incomplete).toBe(true);
  });

  it('rejects an implausible partial value as invalid, not incomplete', () => {
    // three letters can never become a valid 2-letter+7-digit passport
    const r = validatePassport('ABC');
    expect(r.incomplete).toBe(false);
    expect(r.valid).toBe(false);
  });

  it('accepts a complete AA0000000-shaped value', () => {
    const r = validatePassport('AB1234567');
    expect(r.valid).toBe(true);
    expect(r.incomplete).toBe(false);
    expect(r.formatted).toBe('AB1234567');
  });

  it('lowercases input and normalizes it before validating', () => {
    expect(validatePassport('ab1234567').valid).toBe(true);
  });

  it('rejects a complete-length value with a wrong shape', () => {
    // digits before letters — same length, wrong pattern
    const r = validatePassport('1234567AB');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(false);
  });

  it('strips non-alphanumeric characters', () => {
    expect(validatePassport('AB-123 4567').formatted).toBe('AB1234567');
  });
});
