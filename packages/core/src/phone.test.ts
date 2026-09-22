import { describe, expect, it } from 'vitest';
import { formatPkPhone, validatePkPhone } from './phone';

describe('validatePkPhone', () => {
  it('treats empty input as incomplete, not invalid', () => {
    const r = validatePkPhone('');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(true);
  });

  it('treats a plausible partial number as incomplete', () => {
    const r = validatePkPhone('03001');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(true);
    expect(r.formatted).toBe('0300-1');
  });

  it('flags a structurally wrong prefix as invalid immediately, not incomplete', () => {
    // second digit must be '3' (03xxxxxxxxx) — a landline-style 021... can
    // never become valid, so it should fail fast rather than sit in
    // "incomplete" limbo forever.
    const r = validatePkPhone('02112345678');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(false);
  });

  it('accepts a complete valid local number and derives e164', () => {
    const r = validatePkPhone('03001234567');
    expect(r.valid).toBe(true);
    expect(r.incomplete).toBe(false);
    expect(r.formatted).toBe('0300-1234567');
    expect(r.e164).toBe('+923001234567');
  });

  it('normalizes a +92 / 92 country-code prefix to the same local number', () => {
    expect(validatePkPhone('+923001234567').e164).toBe('+923001234567');
    expect(validatePkPhone('923001234567').e164).toBe('+923001234567');
  });

  it('detects carrier by prefix range', () => {
    expect(validatePkPhone('03001234567').carrier).toBe('Jazz');
    expect(validatePkPhone('03101234567').carrier).toBe('Zong');
    expect(validatePkPhone('03301234567').carrier).toBe('Ufone');
    expect(validatePkPhone('03401234567').carrier).toBe('Telenor');
  });

  it('leaves carrier undefined for an unrecognized prefix range', () => {
    const r = validatePkPhone('03601234567');
    expect(r.valid).toBe(true);
    expect(r.carrier).toBeUndefined();
  });

  it('formats progressively as digits accumulate', () => {
    expect(formatPkPhone('0300')).toBe('0300');
    expect(formatPkPhone('03001234567')).toBe('0300-1234567');
  });
});
