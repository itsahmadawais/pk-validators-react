import { useCallback, useMemo, useState } from 'react';
import { validatePkPhone } from '@pk-validators/core';

export function usePkPhone(initial = '') {
  const [raw, setRaw] = useState(initial);

  const result = useMemo(() => validatePkPhone(raw), [raw]);

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
    e164: result.e164,
    carrier: result.carrier,
    error: !result.valid && !result.incomplete ? 'Invalid mobile number' : undefined,
  };
}
