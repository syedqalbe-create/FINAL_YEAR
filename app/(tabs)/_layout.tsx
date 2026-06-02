import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Platform, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const tabWidth = screenWidth / state.routes.length;
  const [translateX] = useState(new Animated.Value(state.index * tabWidth));

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.background,
      height: 70 + (Platform.OS === 'ios' ? insets.bottom : 0),
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      position: 'relative',
    }}>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 18,
          left: (tabWidth - 24) / 2,
          width: 24,
          height: 2,
          borderRadius: 1,
          backgroundColor: colors.primary,
          transform: [{ translateX }],
          zIndex: 1,
        }}
      />
      {/* Tab buttons */}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconName = () => {
          switch (route.name) {
            case 'index':
              return 'home-outline';
            case 'products':
              return 'grid-outline';
            case 'cart':
              return 'cart-outline';
            case 'profile':
              return 'person-outline';
            default:
              return 'home-outline';
          }
        };

        const getTitle = () => {
          switch (route.name) {
            case 'index':
              return 'Home';
            case 'products':
              return 'Products';
            case 'cart':
              return 'Cart';
            case 'profile':
              return 'Profile';
            default:
              return 'Home';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Ionicons
              name={getIconName()}
              size={24}
              color={isFocused ? colors.primary : colors.textMuted}
              style={{ marginBottom: 4 }}
            />
            
            {/* Label */}
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Inter_500Medium',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                color: isFocused ? colors.primary : colors.textMuted,
                marginTop: 2,
              }}
            >
              {getTitle()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}