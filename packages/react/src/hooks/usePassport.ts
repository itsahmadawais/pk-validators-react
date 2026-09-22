import { useCallback, useMemo, useState } from 'react';
import { validatePassport } from '@pk-validators/core';

export function usePassport(initial = '') {
  const [raw, setRaw] = useState(initial);

  const result = useMemo(() => validatePassport(raw), [raw]);

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
    error: !result.valid && !result.incomplete ? 'Invalid passport number' : undefined,
  };
}
