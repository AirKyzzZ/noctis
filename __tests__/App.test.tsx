import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '../providers/AuthContext';
import { ProfileProvider } from '../providers/ProfileContext';

describe('App Providers', () => {
  it('renders AuthProvider without crashing', async () => {
    const { getByText } = render(
      <AuthProvider>
        <Text>Test Content</Text>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    });
  });

  it('renders ProfileProvider without crashing', async () => {
    const { getByText } = render(
      <ProfileProvider>
        <Text>Test Content</Text>
      </ProfileProvider>
    );
    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    });
  });
});


