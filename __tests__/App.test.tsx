import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../supabase/client', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('App', () => {
  it('renders auth form by default', async () => {
    const { findByPlaceholderText, findByText } = render(<App />);
    expect(await findByPlaceholderText('Email')).toBeTruthy();
    expect(await findByText("S'inscrire")).toBeTruthy();
  });
});


