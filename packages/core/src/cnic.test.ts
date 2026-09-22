import { describe, expect, it } from 'vitest';
import { formatCnic, validateCnic } from './cnic';

describe('validateCnic', () => {
  it('treats empty input as incomplete, not invalid', () => {
    const r = validateCnic('');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(true);
    expect(r.formatted).toBe('');
  });

  it('treats partial digits as incomplete, not invalid', () => {
    const r = validateCnic('35202');
    expect(r.valid).toBe(false);
    expect(r.incomplete).toBe(true);
    expect(r.formatted).toBe('35202');
  });

  it('formats partial input with dashes as digits accumulate', () => {
    expect(formatCnic('352021234')).toBe('35202-1234');
    expect(formatCnic('3520212345')).toBe('35202-12345');
  });

  it('accepts a complete 13-digit CNIC as valid', () => {
    const r = validateCnic('3520212345671');
    expect(r.valid).toBe(true);
    expect(r.incomplete).toBe(false);
    expect(r.formatted).toBe('35202-1234567-1');
  });

  it('accepts a complete CNIC already containing dashes', () => {
    const r = validateCnic('35202-1234567-1');
    expect(r.valid).toBe(true);
    expect(r.formatted).toBe('35202-1234567-1');
  });

  it('derives gender from the last digit (odd = male, even = female)', () => {
    expect(validateCnic('3520212345671').gender).toBe('male');
    expect(validateCnic('3520212345672').gender).toBe('female');
  });

  it('ignores non-digit characters and caps at 13 digits', () => {
    const r = validateCnic('3520212345671999');
    expect(r.formatted).toBe('35202-1234567-1');
    expect(r.valid).toBe(true);
  });

  it('does not set gender while incomplete', () => {
    expect(validateCnic('352021234').gender).toBeUndefined();
  });
});
