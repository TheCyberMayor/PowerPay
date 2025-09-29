import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    primaryContainer: '#4CAF50',
    secondary: '#FFC107',
    secondaryContainer: '#FFE082',
    tertiary: '#FF5722',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#F44336',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    onError: '#FFFFFF',
    outline: '#E0E0E0',
    outlineVariant: '#EEEEEE',
  },
  fonts: {
    ...DefaultTheme.fonts,
    headlineLarge: {
      fontFamily: 'Roboto-Bold',
      fontSize: 32,
      fontWeight: '700',
    },
    headlineMedium: {
      fontFamily: 'Roboto-Bold',
      fontSize: 28,
      fontWeight: '700',
    },
    headlineSmall: {
      fontFamily: 'Roboto-Medium',
      fontSize: 24,
      fontWeight: '600',
    },
    titleLarge: {
      fontFamily: 'Roboto-Medium',
      fontSize: 22,
      fontWeight: '600',
    },
    titleMedium: {
      fontFamily: 'Roboto-Medium',
      fontSize: 16,
      fontWeight: '600',
    },
    bodyLarge: {
      fontFamily: 'Roboto-Regular',
      fontSize: 16,
      fontWeight: '400',
    },
    bodyMedium: {
      fontFamily: 'Roboto-Regular',
      fontSize: 14,
      fontWeight: '400',
    },
    bodySmall: {
      fontFamily: 'Roboto-Regular',
      fontSize: 12,
      fontWeight: '400',
    },
  },
};