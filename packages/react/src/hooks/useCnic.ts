import { useCallback, useMemo, useState } from 'react';
import { validateCnic } from '@pk-validators/core';

export function useCnic(initial = '') {
  const [raw, setRaw] = useState(initial);

  const result = useMemo(() => validateCnic(raw), [raw]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const next = typeof e === 'string' ? e : e.target.value;
      setRaw(next);
    },
    []
  );

  return {
    value: result.formatted,
    rawValue: raw,
    formatted: result.formatted,
    onChange,
    isValid: result.valid,
    isComplete: !result.incomplete,
    gender: result.gender,
    error: !result.valid && !result.incomplete ? 'Invalid CNIC number' : undefined,
  };
}
