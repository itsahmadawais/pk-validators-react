import { describe, expect, it } from 'vitest';
import { pkCnicSchema, pkPassportSchema, pkPhoneSchema } from './zod';

describe('pkCnicSchema', () => {
  it('passes a valid CNIC', () => {
    expect(pkCnicSchema.safeParse('3520212345671').success).toBe(true);
  });

  it('fails an incomplete/invalid CNIC', () => {
    expect(pkCnicSchema.safeParse('12345').success).toBe(false);
  });
});

describe('pkPhoneSchema', () => {
  it('passes a valid mobile number', () => {
    expect(pkPhoneSchema.safeParse('03001234567').success).toBe(true);
  });

  it('fails a landline-shaped number', () => {
    expect(pkPhoneSchema.safeParse('02112345678').success).toBe(false);
  });
});

describe('pkPassportSchema', () => {
  it('passes a valid passport number', () => {
    expect(pkPassportSchema.safeParse('AB1234567').success).toBe(true);
  });

  it('fails a malformed passport number', () => {
    expect(pkPassportSchema.safeParse('1234567AB').success).toBe(false);
  });
});
