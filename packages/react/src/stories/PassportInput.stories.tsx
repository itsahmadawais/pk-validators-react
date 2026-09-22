import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PassportInput } from '../PassportInput';

const meta: Meta<typeof PassportInput> = {
  title: 'Inputs/Passport Input',
  component: PassportInput,
  argTypes: {
    locale: { control: 'radio', options: ['en', 'ur'] },
  },
};
export default meta;

type Story = StoryObj<typeof PassportInput>;

function Wrapper(props: React.ComponentProps<typeof PassportInput>) {
  const [value, setValue] = useState(props.value ?? '');
  return <PassportInput {...props} value={value} onChange={setValue} />;
}

export const Empty: Story = {
  render: (args) => <Wrapper {...args} value="" />,
};

export const WhileTyping: Story = {
  render: (args) => <Wrapper {...args} value="AB123" />,
};

export const Valid: Story = {
  render: (args) => <Wrapper {...args} value="AB1234567" />,
};

export const Invalid: Story = {
  // three letters can never become a valid 2-letter+7-digit passport
  render: (args) => <Wrapper {...args} value="ABC" />,
};

export const Urdu: Story = {
  render: (args) => <Wrapper {...args} value="" locale="ur" />,
};
