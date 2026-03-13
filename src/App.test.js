import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  const { getByText } = render(<App />);
  expect(getByText(/An's wholesome Weather/i)).toBeInTheDocument();
});

test('renders search input', () => {
  const { getByPlaceholderText } = render(<App />);
  expect(getByPlaceholderText(/search any city/i)).toBeInTheDocument();
});

test('renders city buttons', () => {
  const { getByText } = render(<App />);
  expect(getByText('London')).toBeInTheDocument();
  expect(getByText('Tokyo')).toBeInTheDocument();
  expect(getByText('Paris')).toBeInTheDocument();
});
