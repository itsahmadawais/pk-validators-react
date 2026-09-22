import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from '../PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Inputs/Phone Input',
  component: PhoneInput,
  argTypes: {
    locale: { control: 'radio', options: ['en', 'ur'] },
  },
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

function Wrapper(props: React.ComponentProps<typeof PhoneInput>) {
  const [value, setValue] = useState(props.value ?? '');
  return <PhoneInput {...props} value={value} onChange={setValue} />;
}

export const Empty: Story = {
  render: (args) => <Wrapper {...args} value="" />,
};

export const WhileTyping: Story = {
  render: (args) => <Wrapper {...args} value="03001" />,
};

export const ValidJazz: Story = {
  render: (args) => <Wrapper {...args} value="03001234567" />,
};

export const ValidZong: Story = {
  render: (args) => <Wrapper {...args} value="03101234567" />,
};

export const Invalid: Story = {
  // second digit isn't '3' -> structurally invalid, not just incomplete
  render: (args) => <Wrapper {...args} value="02112345678" />,
};

export const Urdu: Story = {
  render: (args) => <Wrapper {...args} value="0210" locale="ur" />,
};
