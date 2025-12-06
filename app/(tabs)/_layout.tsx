import { Tabs} from 'expo-router';
import { Text } from 'react-native';

export default function Layout() {
  return (
   <Tabs>
    <Tabs.Screen name="HomePage/index" options={{ 
        title: 'Extrato', 
        headerShown:false,
        tabBarIcon: ({focused, color, size}) => <Text>🏠</Text>,
        
        }} />
    <Tabs.Screen name="DashbordPage/index" options={{ title: 'Dashboard',
        headerShown:true,
        tabBarIcon: ({focused, color, size}) => <Text>📊</Text>,
     }} />
   </Tabs>
)}