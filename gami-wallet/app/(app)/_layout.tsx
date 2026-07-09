import { Tabs } from 'expo-router';
import { Home, Trophy, Sparkles, Package, User } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#100B1C',
          borderTopColor: '#241B3F',
          borderTopWidth: 2,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#6E3CFB',
        tabBarInactiveTintColor: '#6E6688',
        tabBarLabelStyle: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 10, textTransform: 'uppercase' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={20} color={color} /> }} />
      <Tabs.Screen name="quests" options={{ title: 'Quests', tabBarIcon: ({ color }) => <Trophy size={20} color={color} /> }} />
      <Tabs.Screen name="nova" options={{ title: 'NOVA', tabBarIcon: ({ color }) => <Sparkles size={20} color={color} /> }} />
      <Tabs.Screen name="stash" options={{ title: 'Stash', tabBarIcon: ({ color }) => <Package size={20} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User size={20} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
