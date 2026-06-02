import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, storeTheme } from '@/utils/storage';

// Define theme types
export type ThemeType = 'light' | 'dark';

// Define theme colors
export const lightTheme = {
  background: '#F8F8FC',
  surface: '#FFFFFF',
  primary: '#5B4EFF',        // Electric violet
  secondary: '#FF6B35',       // Warm coral accent
  accent: '#EEF0FF',
  border: '#E4E4F0',
  text: '#0F0E17',
  textSecondary: '#6B6B7B',
  textMuted: '#B0B0C0',
  error: '#E53E3E',
  success: '#38A169',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E4E4F0',
  card: '#FFFFFF',
  cardBorder: '#E4E4F0',
  icon: '#5B4EFF',
  iconInactive: '#B0B0C0',
};

export const darkTheme = {
  background: '#0F0E17',
  surface: '#1A1927',
  primary: '#7B70FF',
  secondary: '#FF6B35',
  accent: '#2A2840',
  border: '#2E2D3D',
  text: '#FFFFFE',
  textSecondary: '#A7A9BE',
  textMuted: '#4E4D6C',
  error: '#FC8181',
  success: '#68D391',
  tabBar: '#0F0E17',
  tabBarBorder: '#2E2D3D',
  card: '#1A1927',
  cardBorder: '#2E2D3D',
  icon: '#7B70FF',
  iconInactive: '#4E4D6C',
};

// Create theme context
type ThemeContextType = {
  theme: ThemeType;
  colors: typeof lightTheme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(deviceTheme === 'dark' ? 'dark' : 'light');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getTheme();
      if (savedTheme !== null) {
        setTheme(savedTheme ? 'dark' : 'light');
      } else {
        setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await storeTheme(newTheme === 'dark');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 