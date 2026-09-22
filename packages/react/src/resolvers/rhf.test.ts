import { describe, expect, it } from 'vitest';
import { pkResolver } from './rhf';

describe('pkResolver', () => {
  it('returns no errors when all enabled fields are valid', async () => {
    const resolver = pkResolver({ cnic: true, phone: true });
    const values = { cnic: '3520212345671', phone: '03001234567' };
    // @ts-expect-error — resolver's 2nd/3rd args (context, options) are unused by this implementation
    const result = await resolver(values, undefined, {});
    expect(result.errors).toEqual({});
    expect(result.values).toEqual(values);
  });

  it('reports a field-level error for an invalid enabled field', async () => {
    const resolver = pkResolver({ cnic: true, phone: true });
    const values = { cnic: '123', phone: '03001234567' };
    // @ts-expect-error — resolver's 2nd/3rd args (context, options) are unused by this implementation
    const result = await resolver(values, undefined, {});
    expect(result.errors.cnic).toMatchObject({ type: 'validate', message: 'Invalid CNIC number' });
    expect(result.errors.phone).toBeUndefined();
  });

  it('ignores fields not enabled in the resolver config', async () => {
    const resolver = pkResolver({ cnic: true });
    const values = { cnic: '3520212345671', phone: 'not-a-phone' };
    // @ts-expect-error — resolver's 2nd/3rd args (context, options) are unused by this implementation
    const result = await resolver(values, undefined, {});
    expect(result.errors).toEqual({});
  });

  it('treats a missing field value as invalid when enabled', async () => {
    const resolver = pkResolver({ passport: true });
    const values = {};
    // @ts-expect-error — resolver's 2nd/3rd args (context, options) are unused by this implementation
    const result = await resolver(values, undefined, {});
    expect(result.errors.passport).toMatchObject({ type: 'validate' });
  });
});
