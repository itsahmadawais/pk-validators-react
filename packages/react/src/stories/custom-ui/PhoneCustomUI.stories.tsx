import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { usePkPhone } from '../../hooks/usePkPhone';

/**
 * Minimal bordered field built entirely from `usePkPhone()` — no
 * `<PhoneInput />` involved. Phone has a genuinely reachable invalid state
 * (unlike CNIC), so this is the clearest place to see `isComplete && !isValid`
 * actually fire.
 */
// Storybook's "Show code" panel defaults to the literal source of the
// `render: () => <CustomPhoneField />` line below, which is useless — the
// actual pattern lives inside CustomPhoneField. This string is shown
// instead via the `docs.source.code` parameter. Keep it in sync with the
// component below if you change it.
const SOURCE = `import { usePkPhone } from 'pk-validators-react';

function CustomPhoneField() {
  const phone = usePkPhone();
  const showError = !phone.isValid && phone.isComplete;

  return (
    <div>
      <label htmlFor="phone" data-error={showError}>
        Mobile number
      </label>
      <input
        id="phone"
        type="tel"
        value={phone.value}
        onChange={phone.onChange}
        placeholder="0300-1234567"
        aria-invalid={showError}
      />
      {showError && <span role="alert">{phone.error}</span>}
      {phone.isValid && (
        <span>
          Valid{phone.carrier ? \` — \${phone.carrier}\` : ''} ({phone.e164})
        </span>
      )}
    </div>
  );
}`;

const meta: Meta = {
  title: 'Guides/Custom UI/Phone',
  parameters: {
    docs: {
      description: {
        component:
          "Try typing a landline-style number (e.g. `021...`) to see the " +
          "error state fire immediately — the 2nd digit not being `3` is " +
          "rejected before 11 digits are even typed. Try `0300...`/" +
          "`0310...` for the valid + carrier state.",
      },
      source: { code: SOURCE, language: 'tsx', type: 'code' },
    },
  },
};
export default meta;

type Story = StoryObj;

function CustomPhoneField() {
  const phone = usePkPhone();
  const showError = !phone.isValid && phone.isComplete;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 320 }}>
      <label
        htmlFor="custom-phone"
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 4,
          color: showError ? '#c0392b' : '#333',
        }}
      >
        Mobile number
      </label>
      <input
        id="custom-phone"
        type="tel"
        value={phone.value}
        onChange={phone.onChange}
        placeholder="0300-1234567"
        aria-invalid={showError}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 12px',
          borderRadius: 8,
          border: `1.5px solid ${showError ? '#c0392b' : phone.isValid ? '#0a6b3f' : '#ccc'}`,
          outline: 'none',
          fontSize: 15,
        }}
      />
      <div style={{ marginTop: 6, fontSize: 12, minHeight: 16 }}>
        {showError && <span style={{ color: '#c0392b' }}>{phone.error}</span>}
        {phone.isValid && (
          <span style={{ color: '#0a6b3f' }}>
            Valid{phone.carrier ? ` — ${phone.carrier}` : ''} ({phone.e164})
          </span>
        )}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <CustomPhoneField />,
};
