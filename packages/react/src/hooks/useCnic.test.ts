import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCnic } from './useCnic';

describe('useCnic', () => {
  it('starts incomplete, not invalid, for empty input', () => {
    const { result } = renderHook(() => useCnic());
    expect(result.current.isValid).toBe(false);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('becomes valid once 13 digits are entered, with formatted value and gender', () => {
    const { result } = renderHook(() => useCnic());
    act(() => result.current.onChange('3520212345671'));
    expect(result.current.isValid).toBe(true);
    expect(result.current.isComplete).toBe(true);
    expect(result.current.value).toBe('35202-1234567-1');
    expect(result.current.formatted).toBe('35202-1234567-1');
    expect(result.current.gender).toBe('male');
  });

  it('reports a partial value as incomplete with no error', () => {
    const { result } = renderHook(() => useCnic());
    act(() => result.current.onChange('35202'));
    expect(result.current.isValid).toBe(false);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
});
