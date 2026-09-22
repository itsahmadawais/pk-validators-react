import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { PhoneInput } from './PhoneInput';

function ControlledPhoneInput() {
  const [value, setValue] = useState('');
  return <PhoneInput value={value} onChange={setValue} />;
}

describe('PhoneInput', () => {
  it('sets aria-invalid to false and shows the hint for empty input', () => {
    render(<ControlledPhoneInput />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText('Format: 0300-1234567')).toBeInTheDocument();
  });

  it('sets aria-invalid to true and shows an alert for a structurally invalid number', () => {
    render(<ControlledPhoneInput />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '02112345678' } });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid mobile number');
  });

  it('shows the detected carrier for a valid number', () => {
    render(<ControlledPhoneInput />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '03001234567' } });
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText('Jazz')).toBeInTheDocument();
  });
});
