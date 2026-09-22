import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePkPhone } from './usePkPhone';

describe('usePkPhone', () => {
  it('starts incomplete, not invalid, for empty input', () => {
    const { result } = renderHook(() => usePkPhone());
    expect(result.current.isValid).toBe(false);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('becomes valid with e164 and carrier once 11 digits are entered', () => {
    const { result } = renderHook(() => usePkPhone());
    act(() => result.current.onChange('03001234567'));
    expect(result.current.isValid).toBe(true);
    expect(result.current.isComplete).toBe(true);
    expect(result.current.e164).toBe('+923001234567');
    expect(result.current.carrier).toBe('Jazz');
    expect(result.current.error).toBeUndefined();
  });

  it('reports a complete but structurally wrong number as invalid, with an error', () => {
    const { result } = renderHook(() => usePkPhone());
    act(() => result.current.onChange('02112345678'));
    expect(result.current.isValid).toBe(false);
    expect(result.current.isComplete).toBe(true);
    expect(result.current.error).toBe('Invalid mobile number');
  });
});
