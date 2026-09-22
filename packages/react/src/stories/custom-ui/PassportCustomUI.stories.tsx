import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { usePassport } from '../../hooks/usePassport';

/**
 * Underlined, label-less field built entirely from `usePassport()` — no
 * `<PassportInput />` involved. Passport rejects implausible input
 * earliest of the three fields: a 3rd letter can never become valid, so it
 * errors well before 9 characters are typed.
 */
// Storybook's "Show code" panel defaults to the literal source of the
// `render: () => <CustomPassportField />` line below, which is useless —
// the actual pattern lives inside CustomPassportField. This string is
// shown instead via the `docs.source.code` parameter. Keep it in sync with
// the component below if you change it.
const SOURCE = `import { usePassport } from 'pk-validators-react';

function CustomPassportField() {
  const passport = usePassport();
  const showError = !passport.isValid && passport.isComplete;

  return (
    <div>
      <input
        value={passport.value}
        onChange={passport.onChange}
        placeholder="AB1234567"
        aria-label="Passport number"
        aria-invalid={showError}
      />
      {showError && <span role="alert">{passport.error}</span>}
      {passport.isValid && <span>Valid passport number.</span>}
    </div>
  );
}`;

const meta: Meta = {
  title: 'Guides/Custom UI/Passport',
  parameters: {
    docs: {
      description: {
        component:
          'Try typing `ABC` — the 3rd letter can never become ' +
          '`[A-Z]{2}[0-9]{7}`, so this errors immediately rather than ' +
          'waiting for 9 characters. Try `AB1234567` for the valid state.',
      },
      source: { code: SOURCE, language: 'tsx', type: 'code' },
    },
  },
};
export default meta;

type Story = StoryObj;

function CustomPassportField() {
  const passport = usePassport();
  const showError = !passport.isValid && passport.isComplete;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 300 }}>
      <input
        value={passport.value}
        onChange={passport.onChange}
        placeholder="AB1234567"
        aria-label="Passport number"
        aria-invalid={showError}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 2px',
          fontSize: 16,
          letterSpacing: 2,
          fontFamily: 'monospace',
          border: 'none',
          borderBottom: `2px solid ${showError ? '#c0392b' : passport.isValid ? '#0a6b3f' : '#999'}`,
          outline: 'none',
          background: 'transparent',
          transition: 'border-color 150ms',
        }}
      />
      <div style={{ marginTop: 6, fontSize: 12, minHeight: 16 }}>
        {showError && <span style={{ color: '#c0392b' }}>{passport.error}</span>}
        {passport.isValid && <span style={{ color: '#0a6b3f' }}>Valid passport number.</span>}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <CustomPassportField />,
};
